$(function () {
  $('#pageHeader').on('mouseleave', function () {
    alert('Elhúztad az egeret a fejléc szövegéről.');
  });

  $('#linkHideP1').on('click', function (e) {
    e.preventDefault();
    $('#para1').hide();
  });

  $('#linkHideP2').on('dblclick', function (e) {
    e.preventDefault();
    $('#para2').hide();
  });

  var originalButtonText = $('#btnSubmit').text();

  $('#btnSubmit').on('mouseenter', function () {
    $(this).text('Kattints ide a jelentkezéshez!');
  });

  $('#btnSubmit').on('mouseleave', function () {
    $(this).text(originalButtonText);
  });

  $('.input-field').each(function () {
    $(this).data('lastY', 0);
  });

  $('.input-field').on('mousemove', function (e) {
    var lastY = $(this).data('lastY');
    if (lastY === 0) {
      $(this).data('lastY', e.pageY);
      return;
    }

    if (e.pageY < lastY) {
      $(this).css('border-color', 'red');
    } else if (e.pageY > lastY) {
      $(this).css('border-color', 'blue');
    }

    $(this).data('lastY', e.pageY);
  });

  $('.input-field').on('click', function () {
    $(this).css('background-color', '#ffffcc');
  });
});