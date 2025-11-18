const sections = {
    calculator: { title: 'Калькулятор MultiFrame', type: 'iframe', url: 'CALCULATOR/index.html', fullscreen: true },
    videos: {
        title: 'Видео о MultiFrame',
        type: 'video-list',
        items: [
            { name: 'MultiFrame', file: 'VIDEO/MultiFrame.mp4' },
            { name: 'Монтаж MultiFrame на объекте', file: 'VIDEO/Монтаж MultiFrame на объекте.mp4' },
            { name: 'Производство MultiFrame', file: 'VIDEO/Производство MultiFrame.mp4' },
            { name: 'Тест на плавление и горение', file: 'VIDEO/Тест на плавление и горение .mp4' }
        ]
    },
    noisemeter: { title: 'Замер ДО и ПОСЛЕ', type: 'iframe', url: 'NOISE LEVEL/index.html', fullscreen: false },
    presentations: {
        title: 'Презентации MultiFrame',
        type: 'pdf-list',
        items: [
            { name: 'Презентация MultiFRAME 24.09.2025', file: 'PRESENTATIONS/Презентация MultiFRAME 24.09.2025_compressed.pdf' },
            { name: 'Презентация Теория акустики 22.10.2025', file: 'PRESENTATIONS/Презентация Теория акустики 22.10.2025 в печать.pdf' }
        ]
    },
    certificates: {
        title: 'Сертификаты MultiFrame',
        type: 'document-list',
        items: [
            { name: 'Патент 1', file: 'SERTIFICATIONS/Патент_1.pdf' },
            { name: 'Патент 2', file: 'SERTIFICATIONS/Патент_2.pdf' },
            { name: 'Сертификат экологического менеджмента качества', file: 'SERTIFICATIONS/Сертификат экологического менеджмента качества.jpg' },
            { name: 'Сертификат экологического менеджмента качества 2', file: 'SERTIFICATIONS/Сертификат экологического менеджмента качества_2.jpg' },
            { name: 'Сертификат экологического менеджмента качества 3', file: 'SERTIFICATIONS/Сертификат экологического менеджмента качества_3.jpg' }
        ]
    },
    photos: { title: 'Фото MultiFrame на объекте', type: 'photo-gallery', items: [] }
};

function generatePhotoList() {
    // Генерируем список фото от 1 до 19 в числовом порядке
    const photoNames = [];
    for (let i = 1; i <= 19; i++) {
        photoNames.push(`${i}.JPG`);
    }

    return photoNames.map(name => ({
        name: name.replace('.JPG', ''),
        file: `PHOTO/Фото монтажа/${name}`
    }));
}

const galleryPhotos = generatePhotoList();
let currentPhotoList = [];
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
const overlayBackButton = document.getElementById('fullscreenBackButton');
let overlayMode = null;
// PDF кэш больше не нужен - используем iframe

// PDF.js больше не используется - используем iframe для прямого просмотра PDF

function setOverlayMode(mode) {
    overlayMode = mode;
    if (mode) {
        overlayBackButton.style.display = 'inline-flex';
        document.documentElement.style.setProperty('--overlay-back-bg', mode === 'video'
            ? 'rgba(0, 100, 79, 0.1)'
            : 'rgba(0, 100, 79, 0.85)');
    } else {
        overlayBackButton.style.display = 'none';
        document.documentElement.style.setProperty('--overlay-back-bg', 'rgba(0, 100, 79, 0.85)');
    }
}

overlayBackButton.addEventListener('click', () => {
    switch (overlayMode) {
        case 'photo':
            closePhotoModal();
            break;
        case 'video':
            closeVideoViewer();
            break;
        case 'pdf':
            closePdfViewer();
            // Перезагружаем страницу для возврата к списку
            const urlParams = new URLSearchParams(window.location.search);
            const section = urlParams.get('section');
            if (section) {
                window.location.href = `viewer.html?section=${section}`;
            } else {
                window.location.href = 'index.html';
            }
            break;
        case 'iframe':
        default:
            window.location.href = 'index.html';
    }
});

// Инициализация страницы
function initViewer() {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionName = urlParams.get('section');
    const itemIndex = urlParams.get('item');
    
    if (!sectionName || !sections[sectionName]) {
        document.getElementById('viewerTitle').textContent = 'Раздел не найден';
        document.getElementById('viewerContent').innerHTML = '<p>Запрошенный раздел не существует.</p>';
        return;
    }
    
    const section = sections[sectionName];
    
    // Если указан индекс элемента, открываем его напрямую
    if (itemIndex !== null) {
        const index = parseInt(itemIndex);
        if (section.items && section.items[index]) {
            openItem(section, section.items[index], index);
            return;
        }
    }
    
    document.getElementById('viewerTitle').textContent = section.title;
    
    // Заполнение списка фото
    if (sectionName === 'photos') {
        section.items = generatePhotoList();
    }
    
    renderContent(section);
}

// Рендеринг контента
function renderContent(section) {
    const content = document.getElementById('viewerContent');
    const container = document.getElementById('viewerContainer');
    const header = document.getElementById('viewerHeader');
    header.style.display = 'flex';
    container.style.padding = '2rem';
    container.style.background = '#fff';
    setOverlayMode(null);
    
    switch (section.type) {
        case 'iframe': {
            const useFullscreen = section.fullscreen !== false;
            const iframeSrc = encodeURI(section.url);
            if (useFullscreen) {
                container.style.padding = '0';
                container.style.background = '#fff';
                header.style.display = 'none';
                setOverlayMode('iframe');
                content.innerHTML = `
                    <div class="iframe-fullscreen fade-in">
                        <iframe src="${iframeSrc}" frameborder="0"></iframe>
                    </div>
                `;
            } else {
                header.style.display = 'flex';
                setOverlayMode(null);
                container.style.padding = '2rem';
                content.innerHTML = `
                    <div class="embedded-iframe-card fade-in">
                        <iframe src="${iframeSrc}" frameborder="0"></iframe>
                    </div>
                `;
            }
            break;
        }
            
        case 'video-list':
            content.innerHTML = `
                <div class="video-list fade-in">
                    ${section.items.map((item, index) => `
                        <div class="video-list-item" onclick="openVideo('${item.file.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}', ${index})">
                            <div class="video-list-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                                </svg>
                            </div>
                            <div class="video-list-info">
                                <h3>${item.name}</h3>
                            </div>
                            <div class="video-list-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'document-list':
            content.innerHTML = `
                <div class="document-list fade-in">
                    ${section.items.map((item, index) => {
                        const isPDF = item.file.endsWith('.pdf');
                        const isImage = item.file.match(/\.(jpg|jpeg|png|gif)$/i);
                        
                        if (isPDF) {
                            return `
                                <div class="document-item" onclick="openPdfViewer('${item.file.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}')">
                                    <div class="document-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none"/>
                                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                    </div>
                                    <div class="document-name">${item.name}</div>
                                </div>
                            `;
                        } else if (isImage) {
                            return `
                                <div class="document-item" onclick="openPhotoModal('${item.file.replace(/'/g, "\\'")}', ${index}, 'certificates')">
                                    <div class="document-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                            <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="document-name">${item.name}</div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            `;
            break;
            
        case 'photo-gallery':
            section.items = galleryPhotos;
            content.innerHTML = `
                <div class="photo-gallery fade-in">
                    ${section.items.map((item, index) => `
                        <div class="photo-item" onclick="openPhotoModal('${item.file.replace(/'/g, "\\'")}', ${index}, 'gallery')">
                            <img src="${encodeURI(item.file)}" alt="${item.name}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        
        case 'pdf-list':
            content.innerHTML = `
                <div class="document-list fade-in">
                    ${section.items.map((item, index) => `
                        <div class="document-item" onclick="openPdfViewer('${item.file.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}')">
                            <div class="document-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="document-name">${item.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
    }
}

// Открытие элемента напрямую
function openItem(section, item, index) {
    if (section.type === 'video-list') {
        openVideo(item.file, item.name, index);
    } else if (section.type === 'document-list') {
        if (item.file.endsWith('.pdf')) {
            openPdfViewer(item.file, item.name);
        } else if (item.file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            openPhotoModal(item.file, index, 'certificates');
        }
    } else if (section.type === 'pdf-list') {
        const item = section.items[index];
        if (item) {
            openPdfViewer(item.file, item.name);
        }
    }
}

function openVideo(videoSrc, videoName, index) {
    const viewerContainer = document.getElementById('viewerContainer');
    const videoViewer = document.getElementById('videoViewer');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoViewerTitle');

    viewerContainer.style.display = 'none';
    videoViewer.classList.add('active');
    setOverlayMode('video');
    videoPlayer.src = encodeURI(videoSrc);
    videoPlayer.play().catch(() => {});
    videoTitle.textContent = videoName;

    const url = new URL(window.location);
    url.searchParams.set('item', index);
    window.history.pushState({}, '', url);
}

function closeVideoViewer() {
    const videoViewer = document.getElementById('videoViewer');
    const videoPlayer = document.getElementById('videoPlayer');
    const viewerContainer = document.getElementById('viewerContainer');

    videoPlayer.pause();
    videoPlayer.src = '';
    videoViewer.classList.remove('active');
    viewerContainer.style.display = 'block';
    setOverlayMode(null);
    resetUrl();
}

// Открытие PDF в полноэкранном режиме через iframe (работает с file://)
function openPdfViewer(pdfFile, pdfName) {
    const viewerContainer = document.getElementById('viewerContainer');
    const header = document.getElementById('viewerHeader');
    const content = document.getElementById('viewerContent');
    
    viewerContainer.style.display = 'block';
    // Убираем padding и margin для максимальной ширины
    viewerContainer.style.padding = '0';
    viewerContainer.style.margin = '0';
    // Скрываем шапку с кнопкой "Назад", используем только полупрозрачную кнопку
    header.style.display = 'none';
    setOverlayMode('pdf');
    
    // Создаем полноэкранный просмотрщик PDF на всю ширину
    content.innerHTML = `
        <div class="pdf-viewer-fullscreen fade-in" style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; margin: 0; padding: 0; overflow: hidden;">
            <iframe 
                src="${encodeURI(pdfFile)}" 
                style="width: 100%; height: 100%; border: none; border-radius: 0; display: block;"
                type="application/pdf"
            ></iframe>
        </div>
    `;
    
    // Обновляем заголовок (он скрыт, но на всякий случай)
    document.getElementById('viewerTitle').textContent = pdfName || 'Презентация';
}

function closePdfViewer() {
    const viewerContainer = document.getElementById('viewerContainer');
    const header = document.getElementById('viewerHeader');
    const content = document.getElementById('viewerContent');
    
    // Очищаем iframe
    const iframe = content.querySelector('iframe');
    if (iframe) {
        iframe.src = '';
    }
    
    // Восстанавливаем padding и margin
    viewerContainer.style.padding = '';
    viewerContainer.style.margin = '';
    // Восстанавливаем шапку
    header.style.display = 'flex';
    setOverlayMode(null);
    resetUrl();
}

function openPhotoModal(file, index, source) {
    const modal = document.getElementById('photoModal');
    const viewerContainer = document.getElementById('viewerContainer');

    if (source === 'certificates') {
        // Фильтруем только изображения (не PDF) для списка фото
        currentPhotoList = sections.certificates.items
            .filter(item => item.file.match(/\.(jpg|jpeg|png|gif)$/i))
            .map(item => ({
                name: item.name,
                file: item.file
            }));
    } else if (source === 'presentations') {
        // Эта функция больше не используется для презентаций
        // Используется openPdfPresentation вместо неё
        return;
    } else {
        currentPhotoList = galleryPhotos;
    }

    if (typeof index !== 'number' || Number.isNaN(index)) {
        // Ищем по имени файла
        currentPhotoIndex = currentPhotoList.findIndex(photo => photo.file === file);
        if (currentPhotoIndex < 0) {
            // Если не найдено, пробуем найти по части пути
            const fileName = file.split('/').pop();
            currentPhotoIndex = currentPhotoList.findIndex(photo => photo.file.includes(fileName));
        }
    } else if (source === 'certificates') {
        // Используем индекс для поиска правильного изображения
        const targetItem = sections.certificates.items[index];
        if (targetItem) {
            const targetFile = targetItem.file;
            // Ищем только среди изображений
            if (targetFile.match(/\.(jpg|jpeg|png|gif)$/i)) {
                currentPhotoIndex = currentPhotoList.findIndex(photo => photo.file === targetFile);
            } else {
                // Если это PDF, не должны попадать сюда, но на всякий случай
                currentPhotoIndex = 0;
            }
        } else {
            currentPhotoIndex = 0;
        }
    } else {
        currentPhotoIndex = index;
    }

    if (currentPhotoIndex < 0) currentPhotoIndex = 0;
    
    // Проверяем что есть фото для отображения
    if (currentPhotoList.length === 0) {
        console.error('Нет фотографий для отображения');
        return;
    }
    
    showPhoto();

    viewerContainer.style.display = 'none';
    modal.classList.add('active');
    setOverlayMode('photo');
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    const viewerContainer = document.getElementById('viewerContainer');
    modal.classList.remove('active');
    viewerContainer.style.display = 'block';
    setOverlayMode(null);
    resetUrl();
}

function showPhoto() {
    const img = document.getElementById('photoActive');
    const counter = document.getElementById('photoCounter');
    const photo = currentPhotoList[currentPhotoIndex];
    if (!photo) return;
    img.classList.remove('photo-fade');
    // force reflow for animation restart
    void img.offsetWidth;
    // Если это data URL (из PDF), используем напрямую, иначе кодируем
    if (photo.isDataUrl) {
        img.src = photo.file;
    } else {
        img.src = encodeURI(photo.file);
    }
    img.alt = photo.name || 'Фото';
    img.classList.add('photo-fade');
    counter.textContent = `${currentPhotoIndex + 1} / ${currentPhotoList.length}`;
}

function nextPhoto() {
    if (!currentPhotoList.length) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoList.length;
    showPhoto();
}

function prevPhoto() {
    if (!currentPhotoList.length) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
    showPhoto();
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 40) {
        nextPhoto();
    } else if (touchEndX - touchStartX > 40) {
        prevPhoto();
    }
}

function resetUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('item');
    window.history.replaceState({}, '', url);
}

const photoWrapper = document.getElementById('photoWrapper');
if (photoWrapper) {
    photoWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    photoWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
}

window.nextPhoto = nextPhoto;
window.prevPhoto = prevPhoto;
window.closePhotoModal = closePhotoModal;
window.openPhotoModal = openPhotoModal;
window.openPdfViewer = openPdfViewer;
window.closePdfViewer = closePdfViewer;
window.openDriveGallery = function(index, source) {
    if (source === 'presentations') {
        const item = sections.presentations.items[index];
        if (item) {
            openPdfViewer(item.file, item.name);
        }
    } else {
        const section = sections.certificates;
        const item = section.items[index];
        if (item) {
            if (item.file.endsWith('.pdf')) {
                openPdfViewer(item.file, item.name);
            } else {
                openPhotoModal(item.file, index, source);
            }
        }
    }
};

// Регистрация Service Worker для оффлайн работы
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        if (!window.serviceWorkerRegistered) {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker зарегистрирован в viewer:', registration.scope);
                    window.serviceWorkerRegistered = true;
                })
                .catch(error => {
                    console.log('Регистрация Service Worker не удалась:', error);
                });
        }
    });
}

// Автоматический переход в полноэкранный режим при загрузке (для viewer.html)
function requestFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log('Ошибка перехода в fullscreen:', err);
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
}

// Переход в полноэкранный режим при загрузке
window.addEventListener('load', () => {
    setTimeout(() => {
        requestFullscreen();
    }, 300);
});

// Также пробуем при первом взаимодействии пользователя
let fullscreenAttempted = false;
['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, () => {
        if (!fullscreenAttempted && !document.fullscreenElement && 
            !document.webkitFullscreenElement && !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            fullscreenAttempted = true;
            setTimeout(() => {
                requestFullscreen();
            }, 100);
        }
    }, { once: true });
});

setOverlayMode(null);
document.addEventListener('DOMContentLoaded', initViewer);
