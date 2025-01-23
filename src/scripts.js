jQuery(document).ready(function ($) {
    new WOW().init();

    const swiper = new Swiper('.case-slider', {
        spaceBetween: 30,
        slidesPerView: 2,
        speed: 2000,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        lazy: {
            loadPrevNext: true, // Загрузка соседних изображений
            loadPrevNextAmount: 2, // Количество соседних изображений для загрузки
        },
        preloadImages: false, // Отключаем предзагрузку
        watchSlidesProgress: true, // Следим за слайдами
        watchSlidesVisibility: true, // Следим за видимостью слайдов
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            767: {
                slidesPerView: 2,
            }
        }
    });

    // Лайтбокс функционал
    const lightbox = $('.lightbox');
    let lightboxImg = $('.lightbox img');
    const notification = $('.notification');

    // Добавляем поддержку масштабирования для мобильных устройств
    let currentScale = 1;
    let startDistance = 0;
    
    // Добавляем переменные для отслеживания позиции
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    
    // Предотвращаем стандартный зум браузера
    lightboxImg.on('touchstart', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            startDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });

    lightboxImg.on('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            
            const currentDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            
            if (startDistance > 0) {
                const scale = (currentDistance / startDistance) * currentScale;
                const limitedScale = Math.min(Math.max(1, scale), 4);
                
                // Применяем только scale, без translate
                $(this).css('transform', `scale(${limitedScale})`);
            }
        }
    });

    lightboxImg.on('touchend', function(e) {
        if (e.touches.length < 2) {
            startDistance = 0;
            // Сохраняем текущий масштаб
            const matrix = new WebKitCSSMatrix($(this).css('transform'));
            currentScale = matrix.a;
        }
    });

    // Сброс масштаба при закрытии лайтбокса
    function resetLightboxZoom() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        lightboxImg.css('transform', 'translate(0, 0) scale(1)');
    }

    // Функция для назначения обработчиков событий
    function attachTouchEvents() {
        const imageWrapper = $('.lightbox-image-wrapper');
        
        lightboxImg.on('touchstart', function(e) {
            e.stopPropagation();
            if (e.touches.length === 2) {
                e.preventDefault();
                startDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
            } else if (e.touches.length === 1 && currentScale > 1) {
                isDragging = true;
                startX = e.touches[0].pageX - translateX;
                startY = e.touches[0].pageY - translateY;
                // Добавляем класс для активного перетаскивания
                $(this).addClass('dragging');
            }
        });

        lightboxImg.on('touchmove', function(e) {
            e.stopPropagation();
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                
                if (startDistance > 0) {
                    const scale = (currentDistance / startDistance) * currentScale;
                    const limitedScale = Math.min(Math.max(1, scale), 4);
                    
                    if (limitedScale < currentScale) {
                        translateX = 0;
                        translateY = 0;
                    }
                    
                    requestAnimationFrame(() => {
                        $(this).css({
                            '-webkit-transform': `translate3d(${translateX}px, ${translateY}px, 0) scale(${limitedScale})`,
                            'transform': `translate3d(${translateX}px, ${translateY}px, 0) scale(${limitedScale})`
                        });
                    });
                    currentScale = limitedScale;
                }
            } else if (e.touches.length === 1 && isDragging && currentScale > 1) {
                e.preventDefault();
                const maxTranslate = (currentScale - 1) * $(this).width() / 2;
                
                translateX = e.touches[0].pageX - startX;
                translateY = e.touches[0].pageY - startY;
                
                translateX = Math.min(Math.max(-maxTranslate, translateX), maxTranslate);
                translateY = Math.min(Math.max(-maxTranslate, translateY), maxTranslate);
                
                requestAnimationFrame(() => {
                    $(this).css({
                        '-webkit-transform': `translate3d(${translateX}px, ${translateY}px, 0) scale(${currentScale})`,
                        'transform': `translate3d(${translateX}px, ${translateY}px, 0) scale(${currentScale})`
                    });
                });
            }
        });

        lightboxImg.on('touchend', function(e) {
            e.stopPropagation();
            if (e.touches.length < 2) {
                isDragging = false;
                startDistance = 0;
                // Удаляем класс активного перетаскивания
                $(this).removeClass('dragging');
                
                if (currentScale <= 1) {
                    currentScale = 1;
                    translateX = 0;
                    translateY = 0;
                    requestAnimationFrame(() => {
                        $(this).css({
                            '-webkit-transform': 'translate3d(0, 0, 0) scale(1)',
                            'transform': 'translate3d(0, 0, 0) scale(1)'
                        });
                    });
                }
            }
        });

        // Добавляем обработчик для клика по обертке изображения
        imageWrapper.on('click', function(e) {
            // Если клик был по обертке, а не по изображению
            if (e.target === this) {
                lightbox.fadeOut(300);
                resetLightboxZoom();
            }
        });
    }

    // Открытие лайтбокса при клике на слайд
    $('.swiper-slide').click(function () {
        const bgImage = $(this).find('.swiper-slide-image').css('background-image');
        const imageUrl = bgImage.replace(/url\(['"](.+)['"]\)/, '$1');
        
        lightbox.empty().append(`
            <div class="lightbox-close"></div>
            <div class="lightbox-image-wrapper">
                <img src="${imageUrl}" alt="Fullscreen Image" style="transform: translate3d(0, 0, 0) scale(1)">
            </div>
        `);
        
        lightboxImg = $('.lightbox img');
        attachTouchEvents();
        lightbox.fadeIn(300);
    });

    // Закрытие лайтбокса
    lightbox.click(function (e) {
        if ($(e.target).hasClass('lightbox') || $(e.target).hasClass('lightbox-close')) {
            lightbox.fadeOut(300);
            resetLightboxZoom(); // Сбрасываем масштаб
        }
    });

    // Закрытие по Escape
    $(document).keydown(function (e) {
        if (e.key === "Escape") {
            lightbox.fadeOut(300);
            resetLightboxZoom(); // Сбрасываем масштаб
        }
    });

    // Плавный скролл к якорю
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });

    // Обработка отправки формы
    $('.form-content-left-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: 'send.php',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Очищаем форму
                    $('.form-content-left-form')[0].reset();
                    notification.find('.notification-text').text('Заявка успешно отправлена!');
                } else {
                    notification.find('.notification-text').text(response.message || 'Ошибка отправки формы');
                }

                // Показываем уведомление
                notification.css('display', 'block');

                // Скрываем уведомление через 3 секунды
                setTimeout(() => {
                    notification.css('animation', 'slideOut 0.3s ease-out');
                    setTimeout(() => {
                        notification.css({
                            'display': 'none',
                            'animation': 'slideIn 0.3s ease-out'
                        });
                    }, 300);
                }, 3000);
            },
            error: function () {
                notification.find('.notification-text').text('Ошибка отправки формы');
                notification.css('display', 'block');
            }
        });
    });

    // Предзагрузка изображений и оптимизация LCP элементов
    const preloadImage = new Image();
    preloadImage.src = './assets/images/pink_splash.png';
    
    $('.main-content__pre-title, .main-content__title').each(function() {
        if ('loading' in HTMLImageElement.prototype) {
            $(this).prop('loading', 'eager');
        }
        $(this).css('visibility', 'visible');
    });
});