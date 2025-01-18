jQuery(document).ready(function ($) {
    new WOW().init();

    const swiper = new Swiper('.case-slider', {
        spaceBetween: 30,
        slidesPerView: 2,
        speed: 2000,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Лайтбокс функционал
    const lightbox = $('.lightbox');
    const lightboxImg = $('.lightbox img');

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
                    $('.form-content-left-form')[0].reset();
                }
            },
            error: function () {
                console.log('Ошибка отправки формы');
            }
        });
    });
});