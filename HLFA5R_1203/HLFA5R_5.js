$(function() {
    const box = $('#doboz');
    const forras = $('#forras');
    const headerContainer = $('#header-container');
    const formSection = $('#form-section');

    $('#btn-add-text').on('click', function() {
        box.text('Programtervező informatikus');
    });

    $('#btn-add-button').on('click', function() {
        if ($('#pti-mi-gomb').length === 0) {
            $('<button>', {
                id: 'pti-mi-gomb',
                type: 'button',
                text: 'PTI MI Gomb'
            }).appendTo(box);
        }
    });

    $('#btn-add-new-button').on('click', function() {
        if ($('#me-geik-pti-gomb').length === 0) {
            $('<button>', {
                id: 'me-geik-pti-gomb',
                type: 'button',
                text: 'ME GEIK-PTI'
            }).insertAfter(forras);
        }
    });

    $('#btn-add-header').on('click', function() {
        if ($('#jq-header').length === 0) {
            $('<h2>', {
                id: 'jq-header',
                text: 'jQuery feladat'
            }).prependTo(headerContainer);
        }
    });

    $('#btn-add-subtitle').on('click', function() {
        if ($('#jq-subtitle').length === 0) {
            $('<h3>', {
                id: 'jq-subtitle',
                text: 'HTML metódusok'
            }).appendTo(headerContainer);
        }
    });

    $('#btn-add-form-header').on('click', function() {
        if ($('#form-header').length === 0) {
            $('<h2>', {
                id: 'form-header',
                text: 'ŰRLAP-HLFA5R'
            }).prependTo(formSection);
        }
    });
});