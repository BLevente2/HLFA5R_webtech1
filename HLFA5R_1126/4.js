$(function () {
  var paragraphs = $('.infoParagraph');
  var form = $('#applyForm');

  $('#btnHideParas').on('click', function () {
    paragraphs.hide();
  });

  $('#btnShowParas').on('click', function () {
    paragraphs.show();
  });

  $('#btnToggleParas').on('click', function () {
    paragraphs.toggle();
  });

  $('#btnOpacity01').on('click', function () {
    form.css('opacity', 0.1);
  });

  $('#btnOpacity05').on('click', function () {
    form.css('opacity', 0.5);
  });

  $('#btnOpacity08').on('click', function () {
    form.css('opacity', 0.8);
  });

  $('#btnHideForm').on('click', function () {
    form.hide();
  });

  $('#btnShowForm').on('click', function () {
    form.show();
  });

  $('#btnToggleForm').on('click', function () {
    form.toggle();
  });
});