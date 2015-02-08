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











// function _scale(scale) {
//     return scale * .2 + .8;
// }
// function _opacity(scale) {
//     return scale * .8 + .2;   
// }

// $(function() {
//     var $container = $('#container');
//     var currentIndex = 0;
    
//     var draging = false;
//     var startAtTop = 0;
//     var startAtY = 0;
//     $(document)
//     .on('touchmove', function (e) {
//         e.preventDefault();
//         if (draging) {
//             var moveToY = e.touches[0].pageY;
//             var pst = (startAtTop - startAtY + moveToY) / $('body').height();
//             pst = Math.min(Math.max(-17, pst), 0);
//             $container.css('top', pst * 100 + '%');

//             var scale = Math.min(1, Math.max(0, 1 - Math.abs(currentIndex + pst)));
//             $container.children().eq(currentIndex).css('-webkit-transform', 'scale('+_scale(scale)+')');
//             $container.children().eq(currentIndex).css('opacity', _opacity(scale));
//             if (currentIndex + pst > 0) {
//                 $container.children().eq(currentIndex).css('-webkit-transform-origin', 'center 50%');
//             } else {
//                 $container.children().eq(currentIndex).css('-webkit-transform-origin', 'center 50%');
//             }
//         }
//     })
//     .on('touchstart', function (e) {
//         e.preventDefault();
//         draging = true;
//         startAtY = e.touches[0].pageY
//         var top = $container.css('top');
//         startAtTop = parseFloat(top) / 100 * $('body').height();
//         $container.removeClass('ani');
//         $container.children().css('-webkit-transform', '');
//         $container.children().css('opacity', '');
//     })
//     .on('touchend', function (e) {
//         if (draging) {
//             $container.addClass('ani');
//             var prevIndex = currentIndex;
//             var next = Math.abs(parseInt($container.css('top')) / 100);
//             if (Math.abs(next - currentIndex) > 1) {
//                 currentIndex = Math.round(next);    
//             } else if (Math.abs(next - currentIndex) > 0.1) {
//                 $container.children().eq(currentIndex).css('-webkit-transform', 'scale('+_scale(0)+')');
//                 $container.children().eq(currentIndex).css('opacity', _opacity(0));
//                 next < currentIndex ? currentIndex-- : currentIndex++;
//             }
//             currentIndex = Math.min(17, Math.max(0, currentIndex));
//             if(prevIndex != currentIndex) {
//                 $container.css('top', -currentIndex + '00%');
//                 $container.children().removeClass('curr');
//                 $container.children().eq(currentIndex).addClass('curr');
//             } else {
//                 $container.css('top', -currentIndex + '00%');
//             }
//             draging = false;
//         }
//     });
//     var audioElement = document.getElementById('media');
//     var $audioBtn = $("#audio_btn");
//     audioElement.src = 'image/bg-music.mp3';
    
//     $(audioElement)
//     .on('play', function() {
//         $audioBtn.removeClass('audio_off').addClass('audio_play');
//     })
//     .on('pause', function() {
//         $audioBtn.removeClass('audio_play').addClass('audio_off');
//     })

//     $audioBtn.on('touchstart', function(e) {
//         if (!audioElement.paused) {
//             audioElement.pause();
//         } else {
//             audioElement.play();
//         }
//         return false;
//     })
// })