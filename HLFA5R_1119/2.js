$(function () {
  // 3. feladat: két bekezdés elrejtése/megjelenítése
  $('#btnHide').on('click', function () {
    $('.toggle-paragraph').hide();
  });

  $('#linkShow').on('click', function (e) {
    e.preventDefault();
    $('.toggle-paragraph').show();
  });

  function hideFirstTwoFromLists() {
    $('#list1 li:lt(2), #list2 li:lt(2)').hide();
  }

  function removeHrefFromLink() {
    $('#linkShow').removeAttr('href');
  }

  // K1 gomb: elrejti a lista két első elemét és href-t
  $('#btnK1').on('click', function () {
    hideFirstTwoFromLists();
    removeHrefFromLink();
  });

  // K2 gomb: elrejti a lista két első elemét és href-t és a K2 gombot
  $('#btnK2').on('click', function () {
    hideFirstTwoFromLists();
    removeHrefFromLink();
    $('#btnK2').hide();
  });

  // K3 gomb: elrejti a fejlécet, lista két első elemét és href-t
  $('#btnK3').on('click', function () {
    $('#pageTitle').hide();
    hideFirstTwoFromLists();
    removeHrefFromLink();
  });

  // K4 gomb: elrejti a lista két első elemét, link szöveget és href-t
  $('#btnK4').on('click', function () {
    hideFirstTwoFromLists();
    $('#linkShow').text('');
    removeHrefFromLink();
  });

  // K5 gomb: elrejti a lista két első elemét, href-t és a táblázat páros sorait
  $('#btnK5').on('click', function () {
    hideFirstTwoFromLists();
    removeHrefFromLink();
    // páros sorok (2., 4. ...) – jQuery-ben :odd, mert 0-tól indexel
    $('#dataTable tr:odd').hide();
  });
});