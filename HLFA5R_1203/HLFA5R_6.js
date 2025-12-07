$(function() {
    $('#remove-box-button').on('click', function() {
        $('#doboz').remove();
    });

    $('#clear-divs-button').on('click', function() {
        $('#doboz').find('div').empty();
    });
});