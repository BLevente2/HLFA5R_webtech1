$(function () {
  var box = $('#animBox');
  var paragraphs = $('#paragraphs');
  var collapsed = false;
  var speed = 800;

  function resetBox() {
    box.stop(true, true).css({
      left: '300px',
      top: '0px',
      width: '300px',
      height: '80px',
      fontSize: '12pt',
      opacity: 1
    });
  }

  $('#btnStartAnimation').on('click', function () {
    resetBox();

    box.animate({
      left: '650px',
      width: '400px',
      fontSize: '30pt'
    }, speed).animate({
      top: '150px',
      width: '260px',
      height: '88px'
    }, speed).animate({
      left: '50px',
      opacity: 0.4
    }, speed).animate({
      left: '300px',
      top: '0px',
      width: '300px',
      height: '80px',
      opacity: 1,
      fontSize: '12pt'
    }, speed, function () {
      alert('VÉGE');
    });
  });

  $('#btnHideParagraphs').on('click', function () {
    paragraphs.slideUp(400, function () {
      alert('Bekezdések elrejtése');
    });
  });

  $('#btnToggleBox').on('click', function () {
    box.stop(true, true);

    if (!collapsed) {
      box.animate({
        width: '150px',
        height: '40px'
      }, speed).animate({
        left: '550px'
      }, speed);
      collapsed = true;
    } else {
      box.animate({
        width: '300px',
        height: '80px'
      }, speed).animate({
        left: '300px'
      }, speed);
      collapsed = false;
    }
  });
});