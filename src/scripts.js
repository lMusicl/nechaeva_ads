jQuery(document).ready(function ($) {
    new WOW().init();

    const swiper = new Swiper('.case-slider', {
        spaceBetween: 30,
        slidesPerView: 2,
        speed: 2000,
        // autoplay: {
        //     delay: 2000,
        //     disableOnInteraction: false,
        //     pauseOnMouseEnter: true,
        // },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
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
    const lightboxImg = $('.lightbox img');
    const notification = $('.notification');

    // Открытие лайтбокса при клике на слайд
    $('.swiper-slide').click(function () {
        const bgImage = $(this).find('.swiper-slide-image').css('background-image');
        const imageUrl = bgImage.replace(/url\(['"](.+)['"]\)/, '$1');
        lightboxImg.attr('src', imageUrl);
        lightbox.fadeIn(300);
    });

    // Закрытие лайтбокса
    lightbox.click(function (e) {
        if ($(e.target).hasClass('lightbox') || $(e.target).hasClass('lightbox-close')) {
            lightbox.fadeOut(300);
        }
    });

    // Закрытие по Escape
    $(document).keydown(function (e) {
        if (e.key === "Escape") {
            lightbox.fadeOut(300);
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
});