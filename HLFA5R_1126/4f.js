$(function () {
  function isIntegerString(s) {
    return /^-?\d+$/.test(s);
  }

  $('#btnCalc').on('click', function () {
    $('#errorMessage').text('');
    $('#result').val('');
    $('#number1, #number2').css('border-color', '');

    var s1 = $('#number1').val().trim();
    var s2 = $('#number2').val().trim();

    if (!isIntegerString(s1) || !isIntegerString(s2)) {
      $('#errorMessage').text('Mindkét mezőben egész számot adj meg!');
      if (!isIntegerString(s1)) {
        $('#number1').css('border-color', 'red');
      }
      if (!isIntegerString(s2)) {
        $('#number2').css('border-color', 'red');
      }
      return;
    }

    var n1 = parseInt(s1, 10);
    var n2 = parseInt(s2, 10);

    var op = $('input[name="operation"]:checked').val();
    if (!op) {
      $('#errorMessage').text('Válassz egy műveletet!');
      return;
    }

    var result;

    if (op === 'add') {
      result = n1 + n2;
    } else if (op === 'sub') {
      result = n1 - n2;
    } else if (op === 'mul') {
      result = n1 * n2;
    } else if (op === 'div') {
      if (n2 === 0) {
        $('#errorMessage').text('Nullával nem lehet osztani!');
        return;
      }
      result = n1 / n2;
    }

    $('#result').val(result);
  });
});