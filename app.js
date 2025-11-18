// Управление заставкой после 3 минут бездействия
class ScreensaverManager {
    constructor() {
        this.idleTime = 0;
        this.idleInterval = null;
        this.resetInterval = null;
        this.IDLE_TIMEOUT = 3 * 60 * 1000; // 3 минуты в миллисекундах
        this.RESET_INTERVAL = 1000; // Проверка каждую секунду
        
        this.screensaver = document.getElementById('screensaver');
        this.screensaverVideo = document.getElementById('screensaverVideo');
        this.mainContent = document.getElementById('mainContent');
        
        this.init();
    }
    
    init() {
        // Отслеживание активности пользователя
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, () => this.resetIdleTime(), true);
        });
        
        // Запуск проверки бездействия
        this.startIdleCheck();
    }
    
    startIdleCheck() {
        this.resetInterval = setInterval(() => {
            this.idleTime += this.RESET_INTERVAL;
            
            if (this.idleTime >= this.IDLE_TIMEOUT) {
                this.showScreensaver();
            }
        }, this.RESET_INTERVAL);
    }
    
    resetIdleTime() {
        this.idleTime = 0;
        if (this.screensaver && !this.screensaver.classList.contains('hidden')) {
            this.hideScreensaver();
        }
    }
    
    showScreensaver() {
        if (this.screensaver && this.screensaverVideo) {
            this.screensaver.classList.remove('hidden');
            this.mainContent.style.pointerEvents = 'none';
            
            // Попытка воспроизвести видео
            this.screensaverVideo.play().catch(err => {
                console.warn('Не удалось воспроизвести видео заставки:', err);
            });
        }
    }
    
    hideScreensaver() {
        if (this.screensaver && this.screensaverVideo) {
            this.screensaver.classList.add('hidden');
            this.mainContent.style.pointerEvents = 'auto';
            this.screensaverVideo.pause();
            this.screensaverVideo.currentTime = 0;
        }
    }
    
    destroy() {
        if (this.resetInterval) {
            clearInterval(this.resetInterval);
        }
        if (this.idleInterval) {
            clearInterval(this.idleInterval);
        }
    }
}

// Инициализация заставки только на главной странице
if (document.getElementById('screensaver')) {
    const screensaverManager = new ScreensaverManager();
}

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применение анимации к карточкам
document.querySelectorAll('.nav-card').forEach(card => {
    observer.observe(card);
});

// Предотвращение контекстного меню на карточках (для сенсорных экранов)
document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Обработка ошибок загрузки видео
if (document.getElementById('screensaverVideo')) {
    document.getElementById('screensaverVideo').addEventListener('error', function() {
        console.warn('Видео заставки не загружено. Проверьте путь к файлу.');
    });
}

// Регистрация Service Worker для оффлайн работы
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker зарегистрирован:', registration.scope);
            })
            .catch(error => {
                console.log('Регистрация Service Worker не удалась:', error);
                // Не критично - приложение будет работать и без него
            });
    });
}

