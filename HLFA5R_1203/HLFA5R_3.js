$(function() {
    var box = $('#anim-box');
    var paragraphs = $('#paragraphs .text-paragraph');
    var speed = 800;
    var fullHeight = box.outerHeight();
    var collapsed = false;

    $('#animate-button').on('click', function() {
        box.stop(true, true);

        box.css({
            left: '300px',
            top: '0px',
            width: '300px',
            height: fullHeight + 'px',
            fontSize: '12pt',
            opacity: 1
        });

        box
            .animate({
                left: '600px',
                width: '400px',
                fontSize: '30pt'
            }, speed)
            .animate({
                top: '120px',
                width: '260px',
                height: fullHeight * 1.1
            }, speed)
            .animate({
                left: '0px',
                opacity: 0.4
            }, speed)
            .animate({
                left: '300px',
                top: '0px',
                width: '300px',
                height: fullHeight,
                fontSize: '12pt',
                opacity: 1
            }, speed, function() {
                alert('VÉGE');
            });
    });

    $('#hide-paragraphs-button').on('click', function() {
        paragraphs.slideUp(speed, function() {
            alert('Bekezdések elrejtése');
        });
    });

    $('#toggle-box-button').on('click', function() {
        box.stop(true, false);

        var targetHeight;
        if (collapsed) {
            targetHeight = fullHeight;
        } else {
            targetHeight = 30;
        }

        box.animate({
                height: targetHeight + 'px'
            },
            speed,
            function() {
                var currentLeft = parseInt(box.css('left'), 10) || 0;
                box.animate({
                        left: (currentLeft + 150) + 'px'
                    },
                    speed
                );
            }
        );

        collapsed = !collapsed;
    });
});