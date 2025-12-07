$(function() {
    $('#calc-form').on('submit', function(event) {
        event.preventDefault();

        var error = $('#error-message');
        var result = $('#result');

        var op1Str = $('#operand1').val().trim();
        var op2Str = $('#operand2').val().trim();
        var operation = $('input[name="operation"]:checked').val();

        error.text('');
        result.val('');

        if (op1Str === '' || op2Str === '') {
            error.text('Adja meg mindkét számot!');
            return;
        }

        var n1 = parseInt(op1Str, 10);
        var n2 = parseInt(op2Str, 10);

        if (isNaN(n1) || isNaN(n2)) {
            error.text('Csak egész számokat adjon meg!');
            return;
        }

        if (!operation) {
            error.text('Válasszon egy műveletet!');
            return;
        }

        var res;

        if (operation === 'add') {
            res = n1 + n2;
        } else if (operation === 'sub') {
            res = n1 - n2;
        } else if (operation === 'mul') {
            res = n1 * n2;
        } else if (operation === 'div') {
            if (n2 === 0) {
                error.text('Nullával nem lehet osztani!');
                return;
            }
            res = n1 / n2;
        } else {
            error.text('Ismeretlen művelet.');
            return;
        }

        result.val(res);
    });

    $('#clear-button').on('click', function() {
        $('#operand1').val('');
        $('#operand2').val('');
        $('input[name="operation"]').prop('checked', false);
        $('#result').val('');
        $('#error-message').text('');
        $('#operand1').focus();
    });
});