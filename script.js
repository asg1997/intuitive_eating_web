// Intersection Observer для анимаций при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Наблюдаем за всеми элементами с классом fade-in-up
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));
});

// FAQ аккордеон
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Закрываем все открытые FAQ
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Открываем текущий, если он был закрыт
        if (!isActive) {
            item.classList.add('active');

            // Отслеживаем открытие FAQ в Яндекс.Метрике
            const questionText = question.querySelector('span').textContent;
            if (typeof ym !== 'undefined') {
                ym(104428361, 'reachGoal', 'faq_opened', {
                    question: questionText
                });
            }
            console.log('📊 FAQ открыт:', questionText);
        }
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Отслеживаем навигацию по разделам в Яндекс.Метрике
            if (typeof ym !== 'undefined') {
                ym(104428361, 'reachGoal', 'section_navigation', {
                    section: targetId.replace('#', '')
                });
            }
            console.log('📊 Переход к разделу:', targetId);
        }
    });
});

// Изменение навигации при скролле
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Добавляем класс .scrolled когда прокрутили больше 50px
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});


// Анимация счетчика (можно добавить реальные цифры)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Анимация речевых пузырей реализована через CSS
// Никакого дополнительного JavaScript не требуется

// Добавление ripple-эффекта для кнопок
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Отслеживаем клики по кнопкам "Узнать о запуске"
        const buttonText = this.textContent.trim();
        if (buttonText.includes('Узнать') || buttonText.includes('запуск')) {
            if (typeof ym !== 'undefined') {
                ym(104428361, 'reachGoal', 'click_subscribe_button', {
                    button_text: buttonText,
                    button_location: this.closest('section')?.id || 'header'
                });
            }
            console.log('📊 Клик на кнопку подписки:', buttonText);
        }
    });
});

// Добавляем CSS для ripple-эффекта динамически
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Обработка формы подписки на email
const emailForm = document.getElementById('emailForm');

if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('.email-input');
        const email = emailInput.value;
        const submitBtn = this.querySelector('button[type="submit"]');

        // Показываем состояние загрузки
        submitBtn.textContent = 'Подписываем...';
        submitBtn.disabled = true;

        // Здесь должна быть интеграция с вашим сервисом email-рассылки
        // Например: Mailchimp, SendPulse, GetResponse и т.д.

        // Имитация отправки (замените на реальный API)
        setTimeout(() => {
            // Отслеживаем подписку в Яндекс.Метрике
            if (typeof ym !== 'undefined') {
                ym(104428361, 'reachGoal', 'email_subscription', {
                    source: 'main_page',
                    email_domain: email.split('@')[1]
                });
            }
            console.log('📊 Email подписка:', email);

            // Создаем сообщение об успехе
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = '✓ Спасибо! Вы подписаны на рассылку';

            // Удаляем форму и показываем сообщение
            this.style.display = 'none';
            this.parentElement.insertBefore(successMessage, this.nextSibling);

            // Можно отправить данные на сервер
            console.log('Email подписан:', email);

            // Пример отправки на сервер (раскомментируйте и настройте):
            /*
            fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            */

        }, 1000);
    });
}

// ========================================
// Карусель историй
// ========================================

class StoryCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.story-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.touchStartX = 0;
        this.touchEndX = 0;

        if (!this.slides.length) return;

        this.init();
    }

    init() {
        // Создаем точки навигации
        this.createDots();

        // Обработчики кнопок
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Обработчики точек
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Поддержка свайпов на мобильных
        const carousel = document.getElementById('storyCarousel');
        carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Обновляем состояние
        this.updateCarousel();
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Перейти к истории ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            this.dotsContainer.appendChild(dot);
        });
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentSlide = index;
        this.updateCarousel();

        // Отслеживаем навигацию по историям в Яндекс.Метрике
        if (typeof ym !== 'undefined') {
            const storyTime = this.slides[index].querySelector('.time-label')?.textContent || `История ${index + 1}`;
            ym(104428361, 'reachGoal', 'story_navigation', {
                story_index: index,
                story_time: storyTime
            });
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                this.nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                this.prevSlide();
            }
        }
    }

    updateCarousel() {
        // Обновляем слайды
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            }
        });

        // Обновляем точки
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentSlide) {
                dot.classList.add('active');
            }
        });

        // Обновляем кнопки
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    }
}

// Инициализация карусели после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new StoryCarousel();
    new FeaturesCarousel();
});

// ========================================
// Карусель функций приложения
// ========================================

class FeaturesCarousel {
    constructor() {
        this.carousel = document.getElementById('featuresCarousel');
        this.prevBtn = document.getElementById('featuresPrevBtn');
        this.nextBtn = document.getElementById('featuresNextBtn');
        this.dotsContainer = document.getElementById('featuresDots');
        this.slides = document.querySelectorAll('.feature-slide');
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.scrollTimeout = null;

        if (!this.carousel || !this.slides.length) return;

        this.init();
    }

    init() {
        // Создаем точки навигации
        this.createDots();

        // Обработчики кнопок
        this.prevBtn.addEventListener('click', () => this.scrollPrev());
        this.nextBtn.addEventListener('click', () => this.scrollNext());

        // Обработчик прокрутки карусели с debounce
        this.carousel.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => this.updateActiveSlide(), 50);
        });

        // Обработчики точек
        const dots = this.dotsContainer.querySelectorAll('.features-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.scrollToSlide(index));
        });

        // Поддержка свайпов на мобильных
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Инициализация
        this.updateActiveSlide();
    }

    createDots() {
        // Создаем 4 точки для 4 страниц (6 слайдов - 3 видимых + 1 = 4 страницы)
        const totalPages = 4;
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'features-dot';
            dot.setAttribute('aria-label', `Перейти к странице ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            this.dotsContainer.appendChild(dot);
        }
    }

    scrollToSlide(pageIndex) {
        // Страница 0 -> слайд 0, страница 1 -> слайд 1, и т.д.
        const slide = this.slides[pageIndex];
        if (slide) {
            const scrollLeft = slide.offsetLeft - parseInt(getComputedStyle(this.carousel).paddingLeft);
            this.carousel.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });

            // Отслеживаем навигацию по функциям в Яндекс.Метрике
            if (typeof ym !== 'undefined') {
                const featureName = slide.querySelector('h3')?.textContent || `Функция ${pageIndex + 1}`;
                ym(104428361, 'reachGoal', 'feature_carousel_navigation', {
                    page_index: pageIndex,
                    feature_name: featureName
                });
            }
        }
    }

    scrollNext() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.carousel).gap);
        this.carousel.scrollBy({
            left: slideWidth + gap,
            behavior: 'smooth'
        });
    }

    scrollPrev() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.carousel).gap);
        this.carousel.scrollBy({
            left: -(slideWidth + gap),
            behavior: 'smooth'
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                this.scrollNext();
            } else {
                // Свайп вправо - предыдущий слайд
                this.scrollPrev();
            }
        }
    }

    updateActiveSlide() {
        // Получаем границы карусели
        const carouselRect = this.carousel.getBoundingClientRect();
        const carouselLeft = carouselRect.left;

        // Находим слайд, который ближе всего к левому краю карусели
        let activeSlideIndex = 0;
        let minDistance = Infinity;

        this.slides.forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const slideLeft = slideRect.left;

            // Расстояние от левого края слайда до левого края карусели
            const distance = Math.abs(slideLeft - carouselLeft);

            if (distance < minDistance) {
                minDistance = distance;
                activeSlideIndex = index;
            }
        });

        // Ограничиваем активную страницу до 3 (всего 4 страницы: 0, 1, 2, 3)
        const activePage = Math.min(activeSlideIndex, 3);
        this.currentIndex = activePage;

        // Обновляем точки (всего 4 точки)
        const dots = this.dotsContainer.querySelectorAll('.features-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });

        // Обновляем кнопки
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= 3;
    }

    getSlidesPerView() {
        // Определяем сколько слайдов видно одновременно
        const carouselWidth = this.carousel.offsetWidth;
        const slideWidth = this.slides[0].offsetWidth;
        return Math.floor(carouselWidth / slideWidth);
    }
}

// ========================================
// Отслеживание интереса к функциям
// ========================================

class FeatureInterestTracker {
    constructor() {
        this.interestData = {};
        this.init();
    }

    init() {
        // Находим все кнопки "Жду"
        const interestButtons = document.querySelectorAll('.feature-interest-btn');

        interestButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleInterestClick(button, index);
            });
        });
    }

    handleInterestClick(button, index) {
        const featureTitle = button.closest('.feature-slide-content').querySelector('h3').textContent;
        const isAlreadyInterested = button.classList.contains('interested');
        const textSpan = button.querySelector('span');

        if (!isAlreadyInterested) {
            // Отмечаем интерес
            button.classList.add('interested');
            if (textSpan) {
                textSpan.textContent = 'Жду!';
            }

            // Отслеживаем интерес
            this.trackInterest(featureTitle, index);

            console.log(`📊 Пользователь заинтересовался функцией: "${featureTitle}"`);
        } else {
            // Убираем интерес
            button.classList.remove('interested');
            if (textSpan) {
                textSpan.textContent = 'Жду';
            }
        }
    }

    trackInterest(featureTitle, index) {
        // Сохраняем данные об интересе
        if (!this.interestData[featureTitle]) {
            this.interestData[featureTitle] = {
                clicks: 0,
                firstClickTime: new Date().toISOString(),
                index: index
            };
        }

        this.interestData[featureTitle].clicks += 1;
        this.interestData[featureTitle].lastClickTime = new Date().toISOString();

        // Отправляем в аналитику
        this.sendAnalytics(featureTitle, index);

        // Выводим текущую статистику в консоль (для разработки)
        console.log('📈 Статистика интереса к функциям:', this.interestData);
    }

    sendAnalytics(featureTitle, index) {
        // Пример интеграции с Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feature_interest', {
                'event_category': 'Features',
                'event_label': featureTitle,
                'feature_index': index
            });
        }

        // Интеграция с Яндекс.Метрикой
        if (typeof ym !== 'undefined') {
            ym(104428361, 'reachGoal', 'feature_interest', {
                feature: featureTitle,
                feature_index: index
            });
        }
        console.log('📊 Интерес к функции:', featureTitle);

        // Можно отправить данные на свой сервер
        /*
        fetch('/api/track-feature-interest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                feature: featureTitle,
                index: index,
                timestamp: new Date().toISOString()
            })
        });
        */
    }

    // Метод для получения статистики
    getInterestStats() {
        return this.interestData;
    }
}

// Инициализация трекера интереса после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.featureTracker = new FeatureInterestTracker();
});

// ========================================
// Таймер обратного отсчета
// ========================================

class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate).getTime();
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.timerElement = document.getElementById('countdownTimer');

        if (!this.daysElement || !this.hoursElement || !this.minutesElement || !this.secondsElement) {
            return;
        }

        this.init();
    }

    init() {
        // Запускаем обновление таймера
        this.updateTimer();

        // Обновляем каждую секунду
        this.interval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        // Если время вышло
        if (distance < 0) {
            clearInterval(this.interval);
            this.showLaunchMessage();
            return;
        }

        // Вычисляем дни, часы, минуты и секунды
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Обновляем отображение
        this.daysElement.textContent = this.formatNumber(days);
        this.hoursElement.textContent = this.formatNumber(hours);
        this.minutesElement.textContent = this.formatNumber(minutes);
        this.secondsElement.textContent = this.formatNumber(seconds);

        // Добавляем анимацию при обновлении секунд
        this.secondsElement.style.animation = 'none';
        setTimeout(() => {
            this.secondsElement.style.animation = 'pulse 0.5s ease';
        }, 10);
    }

    formatNumber(num) {
        return num < 10 ? '0' + num : num;
    }

    showLaunchMessage() {
        if (this.timerElement) {
            this.timerElement.innerHTML = `
                <div class="countdown-launch">
                    <div class="launch-icon">🎉</div>
                    <h3>Приложение запущено!</h3>
                    <p>Скачай прямо сейчас</p>
                </div>
            `;
        }
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Инициализация таймера обратного отсчета
document.addEventListener('DOMContentLoaded', () => {
    // Дата запуска: 10 ноября 2025, 00:00:00
    const launchDate = 'November 10, 2025 00:00:00';
    window.countdownTimer = new CountdownTimer(launchDate);
});

// ========================================
// Cookie Notice
// ========================================

class CookieNotice {
    constructor() {
        this.cookieNotice = document.getElementById('cookieNotice');
        this.acceptButton = document.getElementById('cookieAccept');
        this.cookieName = 'cookie_consent';
        this.cookieExpireDays = 365;

        if (!this.cookieNotice || !this.acceptButton) return;

        this.init();
    }

    init() {
        // Проверяем, было ли уже дано согласие
        if (!this.getCookie(this.cookieName)) {
            // Показываем баннер с небольшой задержкой для лучшего UX
            setTimeout(() => {
                this.showNotice();
            }, 1000);
        }

        // Обработчик кнопки "Понятно"
        this.acceptButton.addEventListener('click', () => {
            this.acceptCookies();
        });
    }

    showNotice() {
        this.cookieNotice.classList.add('show');
    }

    hideNotice() {
        this.cookieNotice.classList.remove('show');
    }

    acceptCookies() {
        // Сохраняем согласие в cookie
        this.setCookie(this.cookieName, 'accepted', this.cookieExpireDays);

        // Скрываем баннер
        this.hideNotice();

        // Отправляем событие в Яндекс.Метрику
        if (typeof ym !== 'undefined') {
            ym(104428361, 'reachGoal', 'cookie_accepted');
        }
        console.log('✓ Пользователь принял использование cookies');
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }
}

// Инициализация cookie notice
document.addEventListener('DOMContentLoaded', () => {
    window.cookieNotice = new CookieNotice();
});

// ========================================
// Мобильное меню
// ========================================

class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileMenuOverlay');
        this.menuLinks = document.querySelectorAll('.mobile-menu-link');

        if (!this.menuBtn || !this.menu || !this.overlay) return;

        this.isOpen = false;
        this.init();
    }

    init() {
        // Обработчик кнопки меню
        this.menuBtn.addEventListener('click', () => this.toggle());

        // Обработчик оверлея
        this.overlay.addEventListener('click', () => this.close());

        // Закрываем меню при клике на ссылку
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Даем время для плавной прокрутки
                setTimeout(() => this.close(), 300);
            });
        });

        // Закрываем меню при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Предотвращаем скролл body когда меню открыто
        this.menu.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.stopPropagation();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.menuBtn.classList.add('active');
        this.menu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Предотвращаем скролл

        // Отслеживаем открытие мобильного меню в Яндекс.Метрике
        if (typeof ym !== 'undefined') {
            ym(104428361, 'reachGoal', 'mobile_menu_opened');
        }
        console.log('📊 Открыто мобильное меню');
    }

    close() {
        this.isOpen = false;
        this.menuBtn.classList.remove('active');
        this.menu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
}

// Инициализация мобильного меню
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu = new MobileMenu();
});

// ========================================
// Отслеживание перехода в Telegram
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const telegramBtn = document.querySelector('.telegram-btn');

    if (telegramBtn) {
        telegramBtn.addEventListener('click', () => {
            // Отслеживаем переход в Telegram в Яндекс.Метрике
            if (typeof ym !== 'undefined') {
                ym(104428361, 'reachGoal', 'telegram_click', {
                    source: 'subscribe_section'
                });
            }
            console.log('📊 Переход в Telegram');
        });
    }
});

// ========================================
// Отслеживание просмотра разделов
// ========================================

const sectionObserverOptions = {
    threshold: 0.5, // Срабатывает, когда 50% секции видимо
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id || entry.target.className;

            // Отслеживаем просмотр секции в Яндекс.Метрике
            if (typeof ym !== 'undefined' && sectionId) {
                ym(104428361, 'reachGoal', 'section_viewed', {
                    section_id: sectionId
                });
                console.log('📊 Просмотр секции:', sectionId);
            }
        }
    });
}, sectionObserverOptions);

// Наблюдаем за основными секциями
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.hero, .familiar, .features, .faq, .subscribe-section, .app-stores-section');
    sections.forEach(section => sectionObserver.observe(section));
});
