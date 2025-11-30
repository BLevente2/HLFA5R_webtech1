$(function () {
  $('#btnHide').on('click', function () {
    $('.toggle-paragraph').hide();
  });

  $('#linkShow').on('click', function (e) {
    e.preventDefault();
    $('.toggle-paragraph').show();
  });
});