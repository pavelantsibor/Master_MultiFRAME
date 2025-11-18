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
        type: 'pdf-gallery',
        items: [
            'PRESENTATIONS/Презентация MultiFRAME 24.09.2025_compressed.pdf',
            'PRESENTATIONS/Презентация Теория акустики 22.10.2025 в печать.pdf'
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
    const photoNames = [
        'IMG_1457.JPG', 'IMG_1458.JPG', 'IMG_1459.JPG', 'IMG_1460.JPG', 'IMG_1461.JPG',
        'IMG_1462.JPG', 'IMG_1463.JPG', 'IMG_1464.JPG', 'IMG_1465.JPG', 'IMG_1466.JPG',
        'IMG_1467.JPG', 'IMG_1468.JPG', 'IMG_1469.JPG', 'IMG_1470.JPG', 'IMG_1471.JPG',
        'IMG_1472.JPG', 'IMG_1473.JPG', 'IMG_1474.JPG', 'IMG_1475.JPG', 'IMG_1476.JPG',
        'IMG_1477.JPG', 'IMG_1478.JPG', 'IMG_1479.JPG', 'IMG_1480.JPG', 'IMG_1481.JPG',
        'IMG_1482.JPG', 'IMG_1483.JPG', 'IMG_1485.JPG', 'IMG_1486.JPG', 'IMG_1487.JPG',
        'IMG_1488.JPG', 'IMG_1489.JPG', 'IMG_1490.JPG', 'IMG_1491.JPG', 'IMG_1492.JPG',
        'IMG_1493.JPG', 'IMG_1494.JPG', 'IMG_1495.JPG', 'IMG_1496.JPG', 'IMG_1497.JPG',
        'IMG_1498.JPG', 'IMG_1499.JPG', 'IMG_1500.JPG', 'IMG_1501.JPG', 'IMG_1519.JPG',
        'IMG_1520.JPG', 'IMG_1521.JPG', 'IMG_1522.JPG', 'IMG_1523.JPG', 'IMG_1524.JPG',
        'IMG_1525.JPG', 'IMG_1526.JPG', 'IMG_1527.JPG', 'IMG_1528.JPG', 'IMG_1529.JPG',
        'IMG_1530.JPG', 'IMG_1531.JPG', 'IMG_1532.JPG', 'IMG_1547.JPG', 'IMG_1548.JPG',
        'IMG_1549.JPG', 'IMG_1550.JPG', 'IMG_1551.JPG', 'IMG_1552.JPG', 'IMG_1553.JPG',
        'IMG_1554.JPG', 'IMG_1573.JPG', 'IMG_1574.JPG', 'IMG_1576.JPG', 'IMG_1577.JPG',
        'IMG_1578.JPG', 'IMG_1579.JPG', 'IMG_1580.JPG', 'IMG_1581.JPG', 'IMG_1582.JPG',
        'IMG_1583.JPG', 'IMG_1584.JPG', 'IMG_1585.JPG', 'IMG_1586.JPG', 'IMG_1587.JPG',
        'IMG_1588.JPG', 'IMG_1604.JPG', 'IMG_1605.JPG', 'IMG_1606.JPG', 'IMG_1607.JPG',
        'IMG_1608.JPG', 'IMG_1609.JPG', 'IMG_1610.JPG', 'IMG_1611.JPG', 'IMG_1612.JPG',
        'IMG_1613.JPG', 'IMG_1614.JPG', 'IMG_1615.JPG', 'IMG_1616.JPG', 'IMG_1617.JPG',
        'IMG_1618.JPG', 'IMG_1619.JPG', 'IMG_1621.JPG'
    ];

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
let pdfCache = new Map(); // Кэш для рендеринга PDF слайдов

// Инициализация PDF.js worker
function initPdfJs() {
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        return true;
    }
    return false;
}

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
                                <div class="document-item" onclick="openDriveGallery(${index}, 'certificates')">
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
        
        case 'pdf-gallery':
            content.innerHTML = `
                <div class="photo-gallery fade-in" id="presentationsGallery">
                    <div style="text-align: center; padding: 2rem; color: #666;">
                        <p>Загрузка презентаций...</p>
                    </div>
                </div>
            `;
            loadPdfPresentations(section.items);
            break;
    }
}

// Открытие элемента напрямую
function openItem(section, item, index) {
    if (section.type === 'video-list') {
        openVideo(item.file, item.name, index);
    } else if (section.type === 'document-list') {
        if (item.file.endsWith('.pdf')) {
            openDriveGallery(index, 'certificates');
        } else if (item.file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            openPhotoModal(item.file, index, 'certificates');
        }
    } else if (section.type === 'pdf-gallery') {
        openPdfPresentation(index, 'presentations');
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

// Загрузка файла как ArrayBuffer (работает с file:// протоколом)
async function loadFileAsArrayBuffer(filePath) {
    // Пробуем XMLHttpRequest с responseType: 'arraybuffer'
    // Это может работать для file:// протокола в некоторых браузерах
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.responseType = 'arraybuffer';
        
        xhr.onload = function() {
            // Для file:// протокола status может быть 0 (успех) или 200
            if (xhr.status === 0 || xhr.status === 200) {
                if (xhr.response) {
                    resolve(xhr.response);
                } else {
                    reject(new Error('Empty response'));
                }
            } else {
                reject(new Error(`Failed to load file: status ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error loading file'));
        };
        
        xhr.ontimeout = function() {
            reject(new Error('Timeout loading file'));
        };
        
        // Устанавливаем таймаут
        xhr.timeout = 30000; // 30 секунд
        
        try {
            xhr.send(null);
        } catch (e) {
            reject(new Error(`Failed to send request: ${e.message}`));
        }
    });
}

// Загрузка и рендеринг PDF презентаций
async function loadPdfPresentations(pdfFiles) {
    const gallery = document.getElementById('presentationsGallery');
    if (!gallery) return;

    // Ждем загрузки PDF.js
    if (!initPdfJs()) {
        let attempts = 0;
        while (typeof pdfjsLib === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        if (!initPdfJs()) {
            gallery.innerHTML = '<div style="text-align: center; padding: 2rem; color: #c00;"><p>Ошибка загрузки библиотеки PDF.js</p></div>';
            return;
        }
    }

    gallery.innerHTML = '';
    
    for (let i = 0; i < pdfFiles.length; i++) {
        const pdfFile = pdfFiles[i];
        const fileName = pdfFile.split('/').pop().replace('.pdf', '');
        
        try {
            // Рендерим первую страницу как превью
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'photo-item';
            loadingDiv.style.position = 'relative';
            loadingDiv.innerHTML = `
                <div style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <p style="color: #666;">Загрузка...</p>
                </div>
            `;
            gallery.appendChild(loadingDiv);

            // Загружаем файл как ArrayBuffer для работы с file:// протоколом
            const arrayBuffer = await loadFileAsArrayBuffer(pdfFile);
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // Сохраняем PDF в кэш
            if (!pdfCache.has(pdfFile)) {
                pdfCache.set(pdfFile, pdf);
            }

            // Заменяем загрузочный блок на превью
            loadingDiv.innerHTML = '';
            loadingDiv.onclick = () => openPdfPresentation(i, 'presentations');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = fileName;
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.cursor = 'pointer';
            loadingDiv.appendChild(img);
            
        } catch (error) {
            console.error('Ошибка загрузки PDF:', pdfFile, error);
            
            // Если загрузка не удалась из-за CORS, показываем сообщение с инструкцией
            const errorDiv = document.createElement('div');
            errorDiv.className = 'photo-item';
            const errorMessage = error.message && error.message.includes('CORS') 
                ? 'Для просмотра PDF необходим локальный веб-сервер' 
                : 'Ошибка загрузки';
            errorDiv.innerHTML = `
                <div style="width: 100%; min-height: 200px; background: #fee; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; color: #c00; padding: 1rem; text-align: center;">
                    <p style="margin: 0.5rem 0;"><strong>${errorMessage}</strong></p>
                    <p style="margin: 0.5rem 0; font-size: 0.9em; color: #666;">
                        ${fileName}
                    </p>
                    <p style="margin: 0.5rem 0; font-size: 0.8em; color: #888;">
                        Запустите локальный веб-сервер:<br>
                        <code style="background: #fff; padding: 0.2rem 0.4rem; border-radius: 4px;">python -m http.server 8000</code>
                    </p>
                </div>
            `;
            gallery.appendChild(errorDiv);
        }
    }
}

// Открытие PDF презентации как слайдов
async function openPdfPresentation(pdfIndex, source) {
    const modal = document.getElementById('photoModal');
    const viewerContainer = document.getElementById('viewerContainer');
    
    const pdfFile = sections.presentations.items[pdfIndex];
    if (!pdfFile) return;

    // Инициализируем PDF.js если еще не инициализирован
    if (!initPdfJs()) {
        let attempts = 0;
        while (typeof pdfjsLib === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        if (!initPdfJs()) {
            alert('Ошибка загрузки библиотеки PDF.js');
            return;
        }
    }

    // Показываем индикатор загрузки
    viewerContainer.style.display = 'none';
    modal.classList.add('active');
    setOverlayMode('photo');
    
    const img = document.getElementById('photoActive');
    const counter = document.getElementById('photoCounter');
    img.src = '';
    counter.textContent = 'Загрузка...';

    try {
        let pdf;
        if (pdfCache.has(pdfFile)) {
            pdf = pdfCache.get(pdfFile);
        } else {
            // Загружаем файл как ArrayBuffer для работы с file:// протоколом
            const arrayBuffer = await loadFileAsArrayBuffer(pdfFile);
            pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            pdfCache.set(pdfFile, pdf);
        }

        const numPages = pdf.numPages;
        currentPhotoList = [];
        
        // Рендерим все страницы
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
            currentPhotoList.push({
                name: `Слайд ${pageNum}`,
                file: imageUrl, // Используем data URL
                isDataUrl: true
            });
        }

        currentPhotoIndex = 0;
        showPhoto();
    } catch (error) {
        console.error('Ошибка открытия PDF:', error);
        counter.textContent = 'Ошибка загрузки';
        img.src = '';
        
        // Показываем сообщение об ошибке
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #c00; padding: 1rem; background: rgba(255,255,255,0.9); border-radius: 8px; max-width: 80%;';
        errorMsg.innerHTML = `
            <p style="margin: 0.5rem 0;"><strong>Ошибка загрузки PDF</strong></p>
            <p style="margin: 0.5rem 0; font-size: 0.9em; color: #666;">
                Для просмотра PDF необходим локальный веб-сервер
            </p>
            <p style="margin: 0.5rem 0; font-size: 0.8em; color: #888;">
                Запустите:<br>
                <code style="background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 4px;">python -m http.server 8000</code>
            </p>
        `;
        const photoWrapper = document.getElementById('photoWrapper');
        if (photoWrapper) {
            photoWrapper.appendChild(errorMsg);
        }
    }
}

function openPhotoModal(file, index, source) {
    const modal = document.getElementById('photoModal');
    const viewerContainer = document.getElementById('viewerContainer');

    if (source === 'certificates') {
        currentPhotoList = sections.certificates.items.filter(item => item.file.match(/\.(jpg|jpeg|png|gif|pdf)$/i)).map(item => ({
            name: item.name,
            file: item.file.endsWith('.pdf') ? item.file.replace('.pdf', '.jpg') : item.file
        }));
    } else if (source === 'presentations') {
        // Эта функция больше не используется для презентаций
        // Используется openPdfPresentation вместо неё
        return;
    } else {
        currentPhotoList = galleryPhotos;
    }

    if (typeof index !== 'number' || Number.isNaN(index)) {
        currentPhotoIndex = currentPhotoList.findIndex(photo => photo.file === file);
    } else if (source === 'certificates') {
        const targetFile = sections.certificates.items[index].file;
        currentPhotoIndex = currentPhotoList.findIndex(photo => photo.file === targetFile);
    } else {
        currentPhotoIndex = index;
    }

    if (currentPhotoIndex < 0) currentPhotoIndex = 0;
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
window.openPdfPresentation = openPdfPresentation;
window.openDriveGallery = function(index, source) {
    if (source === 'presentations') {
        openPdfPresentation(index, source);
    } else {
        const section = sections.certificates;
        openPhotoModal(section.items[index], index, source);
    }
};

setOverlayMode(null);
document.addEventListener('DOMContentLoaded', initViewer);
