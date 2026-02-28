document.addEventListener('DOMContentLoaded', () => {
    // Navbar visual effect on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Populate Gallery Section
    const galleryGrid = document.getElementById('galleryGrid');

    // =========================================================================
    // 💡 [사진 및 설명 수정하는 곳] 💡
    // 아래 배열(galleryData)의 내용을 수정하여 원하는 사진과 글로 변경하세요.
    // src: '이미지 경로' (예: images 폴더 안에 넣은 사진 이름)
    // caption: '사진에 띄울 설명'
    // =========================================================================
    const galleryData = [
        { src: 'images/1.jpg', caption: 'LG 멀티 V5 압축기 고장 점검 #1' },
        { src: 'images/2.jpg', caption: '용산 오피스텔 스탠드에어컨 설치 #2' },
        { src: 'images/3.jpg', caption: 'LG 멀티v5 압축기교체 #3' },
        { src: 'images/4.jpg', caption: '삼성 dvm s모델 점검#4' },
        { src: 'images/5.jpg', caption: '안양 시스템 에어컨 시공완료 #5' },
        { src: 'images/6.jpg', caption: '시스템에어컨 압축기 전체교체 #6' },
        { src: 'images/7.jpg', caption: '전철역 시스템에어컨 PCB점검 #7' },
        { src: 'images/8.jpg', caption: '의정부 골프장 삼성 시스템 에어컨 점검 #8' },
        { src: 'images/9.jpg', caption: 'LG 천장형 에어컨 모터수리 #9' },
        { src: 'images/10.jpg', caption: '교육청 에어컨 세척현장 #10' },
        { src: 'images/11.jpg', caption: '학교 시스템에어컨 수리현장 #11' },
        { src: 'images/12.jpg', caption: '인천 카페 에어컨세척 현장 #12' },
        // ... 원하시는 만큼 줄을 추가하거나 삭제하시면 됩니다. 
    ];

    // 갤러리 렌더링 루프
    galleryData.forEach((data) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        item.innerHTML = `
            <img src="${data.src}" class="gallery-img" alt="${data.caption}" loading="lazy">
            <div class="gallery-overlay">
                <span>${data.caption}</span>
            </div>
        `;
        galleryGrid.appendChild(item);
    });

    // Intersection Observer for scroll animations (fade up / slide in)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // We leave it observed so it can fade out and in again if wanted, but typically we unobserve.
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe the business card
    const businessCard = document.querySelector('.business-card');
    if (businessCard) observer.observe(businessCard);

    // Observe each gallery item, assigning a dynamic transition delay to create a staggering effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        // Stagger every row of 4 items
        item.style.transitionDelay = `${(index % 4) * 0.15}s`;
        observer.observe(item);
    });

    // --- User Photo Upload Logic ---
    const btnOpenUploadModal = document.getElementById('btnOpenUploadModal');
    const uploadModalOverlay = document.getElementById('uploadModalOverlay');
    const btnCloseUploadModal = document.getElementById('btnCloseUploadModal');
    const uploadForm = document.getElementById('uploadForm');
    const userGalleryGrid = document.getElementById('userGalleryGrid');

    // Load custom photos from localStorage
    let customPhotos = JSON.parse(localStorage.getItem('airconCustomPhotos')) || [];

    // Render custom photos
    function renderCustomPhotos() {
        userGalleryGrid.innerHTML = '';
        customPhotos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item visible'; // Auto-visible upon rendering
            item.style.transitionDelay = '0s';

            item.innerHTML = `
                <img src="${photo.imageBase64}" class="gallery-img" alt="${photo.desc || '업로드된 사진'}" loading="lazy">
                <div class="gallery-overlay">
                    <span>${photo.desc || '시공 현장 사진'}</span>
                    <span class="date">${photo.date}</span>
                </div>
                <button class="btn-delete-photo" data-id="${photo.id}" title="사진 삭제">✖</button>
            `;
            userGalleryGrid.appendChild(item);
        });

        // Add delete event listeners
        document.querySelectorAll('.btn-delete-photo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = parseInt(e.target.getAttribute('data-id'));
                if (confirm('이 사진을 정말 삭제하시겠습니까?')) {
                    customPhotos = customPhotos.filter(p => p.id !== idToDelete);
                    localStorage.setItem('airconCustomPhotos', JSON.stringify(customPhotos));
                    renderCustomPhotos();
                }
            });
        });
    }

    // Initial render
    renderCustomPhotos();

    // Open Upload Modal
    if (btnOpenUploadModal) {
        btnOpenUploadModal.addEventListener('click', () => {
            uploadModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Upload Modal
    function closeUploadModal() {
        uploadModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        uploadForm.reset();
    }

    if (btnCloseUploadModal) {
        btnCloseUploadModal.addEventListener('click', closeUploadModal);
    }

    if (uploadModalOverlay) {
        uploadModalOverlay.addEventListener('click', (e) => {
            if (e.target === uploadModalOverlay) {
                closeUploadModal();
            }
        });
    }

    // Handle Form Submit (FileReader)
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fileInput = document.getElementById('uploadPhoto');
            const descInput = document.getElementById('uploadDesc').value;

            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];

                // Check simple size validation (> 2MB warning but still try to process)
                if (file.size > 2 * 1024 * 1024) {
                    alert('파일 크기가 2MB를 초과하여 브라우저 용량 제한에 걸릴 수 있습니다.');
                }

                const reader = new FileReader();

                reader.onload = function (event) {
                    const base64String = event.target.result;

                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    const formattedDate = `${yyyy}-${mm}-${dd}`;

                    const newPhoto = {
                        id: Date.now(),
                        imageBase64: base64String,
                        desc: descInput,
                        date: formattedDate
                    };

                    // Try saving to localStorage (catch QuotaExceededError)
                    try {
                        customPhotos.unshift(newPhoto); // Add to front
                        localStorage.setItem('airconCustomPhotos', JSON.stringify(customPhotos));
                        renderCustomPhotos();
                        closeUploadModal();
                        alert('사진이 성공적으로 등록되었습니다.');
                    } catch (error) {
                        console.error('LocalStorage Error:', error);
                        // Revert the array push since saving failed
                        customPhotos.shift();
                        alert('저장 공간(localStorage) 용량이 초과되었습니다. 사진을 압축하거나 이전 사진을 삭제해주세요.');
                    }
                };

                reader.onerror = function () {
                    alert('파일을 읽는 도중 오류가 발생했습니다.');
                };

                // Read file as Base64 Data URL
                reader.readAsDataURL(file);
            }
        });
    }
});
