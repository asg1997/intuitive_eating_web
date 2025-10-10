// Аналитика для статей - intuitive-eating.ru
// События Яндекс.Метрики для отслеживания поведения на статьях

(function () {
    'use strict';

    // Проверка загрузки Яндекс.Метрики
    if (typeof ym === 'undefined') {
        console.warn('Яндекс.Метрика не загружена');
        return;
    }

    const METRIKA_ID = 104428361;

    // Получаем название статьи из H1
    const articleTitle = document.querySelector('.article-header-title')?.textContent?.trim() || 'Unknown Article';
    const articleCategory = document.querySelector('.article-category')?.textContent?.trim() || 'Unknown Category';

    // 1. Отслеживание просмотра статьи
    ym(METRIKA_ID, 'reachGoal', 'article_viewed', {
        article_title: articleTitle,
        article_category: articleCategory
    });
    console.log('📊 Метрика: Просмотр статьи', articleTitle);

    // 2. Отслеживание времени на странице
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 10;

        // Отправляем события каждые 30 секунд
        if (timeOnPage % 30 === 0) {
            ym(METRIKA_ID, 'reachGoal', 'article_reading_time', {
                article_title: articleTitle,
                seconds: timeOnPage
            });
            console.log(`📊 Метрика: Время чтения ${timeOnPage}с`);
        }

        // Останавливаем через 5 минут
        if (timeOnPage >= 300) {
            clearInterval(timeInterval);
        }
    }, 10000);

    // 3. Отслеживание прокрутки статьи
    const scrollMilestones = [25, 50, 75, 100];
    const reachedMilestones = new Set();

    function trackScroll() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        scrollMilestones.forEach(milestone => {
            if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
                reachedMilestones.add(milestone);
                ym(METRIKA_ID, 'reachGoal', 'article_scroll', {
                    article_title: articleTitle,
                    scroll_depth: milestone
                });
                console.log(`📊 Метрика: Прокрутка ${milestone}%`);
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScroll, 150);
    });

    // 4. Клик на источник статьи
    const sourceLink = document.querySelector('.article-source a');
    if (sourceLink) {
        sourceLink.addEventListener('click', () => {
            ym(METRIKA_ID, 'reachGoal', 'article_source_click', {
                article_title: articleTitle,
                source_url: sourceLink.href
            });
            console.log('📊 Метрика: Клик на источник');
        });
    }

    // 5. Клик на кнопку подписки из статьи
    const subscribeButtons = document.querySelectorAll('.article-subscribe .btn, .article-cta .btn');
    subscribeButtons.forEach(button => {
        button.addEventListener('click', () => {
            ym(METRIKA_ID, 'reachGoal', 'article_subscribe_click', {
                article_title: articleTitle,
                button_location: button.closest('.article-subscribe') ? 'bottom_block' : 'inline_cta'
            });
            console.log('📊 Метрика: Клик на подписку из статьи');
        });
    });

    // 6. Переход к другим статьям
    const relatedLinks = document.querySelectorAll('.related-articles .article-card-link, .articles-grid .article-card-link');
    relatedLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTitle = link.querySelector('.article-title')?.textContent?.trim() || 'Unknown';
            ym(METRIKA_ID, 'reachGoal', 'article_to_article_click', {
                from_article: articleTitle,
                to_article: targetTitle
            });
            console.log('📊 Метрика: Переход к статье', targetTitle);
        });
    });

    // 7. Клик на "Назад к статьям"
    const backLink = document.querySelector('.article-back-link');
    if (backLink) {
        backLink.addEventListener('click', () => {
            ym(METRIKA_ID, 'reachGoal', 'article_back_to_list', {
                article_title: articleTitle
            });
            console.log('📊 Метрика: Назад к списку статей');
        });
    }

    // 8. Клик на Telegram из статьи
    const telegramBtn = document.querySelector('.article-subscribe .telegram-btn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', () => {
            ym(METRIKA_ID, 'reachGoal', 'telegram_click', {
                source: 'article',
                article_title: articleTitle
            });
            console.log('📊 Метрика: Клик Telegram из статьи');
        });
    }

    // 9. Отслеживание комментариев Reddit (если есть)
    const redditComments = document.querySelectorAll('.reddit-comment');
    if (redditComments.length > 0) {
        ym(METRIKA_ID, 'reachGoal', 'reddit_style_article', {
            article_title: articleTitle,
            comments_count: redditComments.length
        });
        console.log('📊 Метрика: Reddit-стиль статья');
    }

    // 10. Выход со страницы (отслеживание дочитывания)
    window.addEventListener('beforeunload', () => {
        const finalScroll = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        ym(METRIKA_ID, 'reachGoal', 'article_exit', {
            article_title: articleTitle,
            time_spent: timeOnPage,
            final_scroll: finalScroll,
            completed_reading: finalScroll >= 80
        });
    });

})();

