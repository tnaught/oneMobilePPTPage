$(function () {

var $pages = $(".page");
var $currentPage = $pages.eq(0);
var $nextPage;
var $prevPage;

$pages.hide();
$currentPage.show();

function $getNextPage () {
    var next = $currentPage.next(".page")[0];
    return next ? $(next) : $pages.eq(0);
}

function $getPrevPage () {
    var prev = $currentPage.prev(".page")[0];
    return prev ? $(prev) : $pages.eq(-1);
}

function translateFormat (y) {
    return "translate(0, "+y+"px)";
}
function scaleFormat (scale) {
    scale = scale * 0.5 + 0.5;
    return "scale("+scale+")";
}

var draging = false;
var startAtY;
var pageHeight;

var transitionEndTimer;
function transitionEnd () {
    clearTimeout(transitionEndTimer);
    $currentPage.removeClass('animate');
    $prevPage.removeClass('animate');
    $nextPage.removeClass('animate');
    $currentPage.hide();
    $prevPage.hide();
    $nextPage.hide();
    $currentPage = $(this).show();
    $(this).off("transitionend", transitionEnd);
    $(document).on('touchstart', touchStart);
    $pages.each(function () {
        if (this === $currentPage[0]) {
            $(this).addClass("curr");
        } else {
            $(this).removeClass("curr");
        }
    })
}

function touchStart (event) {
    draging = true;
    startAtY = event.touches[0].pageY;
    $nextPage = $getNextPage().show().css('z-index', 1);
    $prevPage = $getPrevPage().show().css('z-index', 1);
    $currentPage.css('z-index', 0);
    pageHeight = $(window).height();
    touchMove(event);
}

function touchEnd (event) {
    if (!draging) return;
    
    $currentPage.addClass('animate');
    $prevPage.addClass('animate');
    $nextPage.addClass('animate');

    var saveTransitionDelay = 300;
    var pageEdge = 20;

    if ($prevPage[0].getBoundingClientRect().bottom > pageEdge) {
        $prevPage.css("-webkit-transform", translateFormat(0));
        $currentPage.css("-webkit-transform", 
            [translateFormat(pageHeight), scaleFormat(0)].join(" ")
        );
        $nextPage.css("-webkit-transform", translateFormat(2*pageHeight));

        $prevPage.on("transitionend", transitionEnd);
        transitionEndTimer = setTimeout(function () {
            $prevPage.trigger("transitionend", transitionEnd);
        }, saveTransitionDelay);

    } else if (pageHeight - $nextPage[0].getBoundingClientRect().top > pageEdge) {
        $prevPage.css("-webkit-transform", translateFormat(-2*pageHeight));
        $currentPage.css("-webkit-transform", 
            [translateFormat(-pageHeight), scaleFormat(0)].join(" ")
        );
        $nextPage.css("-webkit-transform", translateFormat(0));

        $nextPage.on("transitionend", transitionEnd);
        transitionEndTimer = setTimeout(function () {
            $nextPage.trigger("transitionend", transitionEnd);
        }, saveTransitionDelay);
    }else {
        $prevPage.css("-webkit-transform", translateFormat(-pageHeight));
        $currentPage.css("-webkit-transform", 
            [translateFormat(0), scaleFormat(1)].join(" ")
        );
        $nextPage.css("-webkit-transform", translateFormat(pageHeight));

        $currentPage.on("transitionend", transitionEnd);
        transitionEndTimer = setTimeout(function () {
            $currentPage.trigger("transitionend", transitionEnd);
        }, saveTransitionDelay);
    }
    $(document).off('touchstart', touchStart);
    draging = false;
}

function touchMove (event) {
    event.preventDefault();
    if (!draging) return;
    
    var y = event.touches[0].pageY - startAtY;
    var scale = 1 - Math.abs(y/$(window).height());
    $currentPage.css("-webkit-transform", 
        [translateFormat(y), scaleFormat(scale)].join(" ")
    );
    $prevPage.css("-webkit-transform", translateFormat(y - pageHeight));
    $nextPage.css("-webkit-transform", translateFormat(y + pageHeight));

}

$(document)
.on('touchstart', touchStart)
.on('touchmove', touchMove)
.on('touchend', touchEnd)

var audioElement = document.getElementById('media');
var $audioBtn = $("#audio_btn");
audioElement.src = 'image/bg-music.mp3';

$(audioElement)
.on('play', function() {
    $audioBtn.removeClass('audio_off').addClass('audio_play');
})
.on('pause', function() {
    $audioBtn.removeClass('audio_play').addClass('audio_off');
})

$audioBtn.on('touchstart', function(e) {
    if (!audioElement.paused) {
        audioElement.pause();
    } else {
        audioElement.play();
    }
    return false;
})

});
