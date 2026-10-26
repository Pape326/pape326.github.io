/*jslint browser, this, for*/
/*global $*/

$(document).ready(function () {
    "use strict";

    var gallery = $(".gallery-slider");
    var pagerCurrent = $("#pager-current");
    var pagerTotal = $("#pager-total");

    function updatePager(slick, currentSlide) {
        var activeDotIndex = 0;
        var currentPage = 1;
        var dots = $("#pager-dots .slick-dots li");
        var totalPages = dots.length;

        if (totalPages > 0) {
            activeDotIndex = $(
                "#pager-dots .slick-dots li.slick-active"
            ).index();
            if (activeDotIndex >= 0) {
                currentPage = activeDotIndex + 1;
            }
        } else if (slick.slideCount && slick.options.slidesToShow) {
            totalPages = Math.ceil(
                slick.slideCount / slick.options.slidesToShow
            );
            currentPage = Math.floor(
                (currentSlide || 0) / slick.options.slidesToScroll
            ) + 1;
        }

        pagerCurrent.text(currentPage);
        pagerTotal.text(totalPages);
    }

    gallery.on(
        "init reInit afterChange",
        function (ignore, slick, currentSlide) {
            updatePager(slick, currentSlide);
        }
    );

    gallery.slick({
        appendDots: "#pager-dots",
        dots: true,
        dotsClass: "slick-dots",
        infinite: false,
        nextArrow: "#arrow-next",
        prevArrow: "#arrow-prev",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ],
        slidesToScroll: 3,
        slidesToShow: 3,
        speed: 300
    });
});
