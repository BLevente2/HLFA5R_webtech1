const jsonUrl = 'HLFA5R_orarend1.json';

function loadSchedule() {
    const error = $('#error-message');
    const studentInfo = $('#student-info');
    const scheduleSection = $('#schedule-section');
    const tbody = $('#schedule-body');
    const terulet = $('#terulet');

    error.text('');
    tbody.empty();
    terulet.empty();

    $.getJSON(jsonUrl)
        .done(function(data) {
            if (data.hallgato && data.hallgato.nev && data.hallgato.neptun) {
                studentInfo.text(data.hallgato.nev + ' – Neptun: ' + data.hallgato.neptun);
            }

            if (Array.isArray(data.orarend) && data.orarend.length > 0) {
                const first = data.orarend[0];

                const firstHtml =
                    '<p><strong>Kurzus:</strong> ' + (first.kurzus || '') + '</p>' +
                    '<p><strong>Nap:</strong> ' + (first.nap || '') + '</p>' +
                    '<p><strong>Időpont:</strong> ' + (first.idopont || '') + '</p>' +
                    '<p><strong>Cím:</strong> ' + (first.cim || '') + '</p>' +
                    '<p><strong>Telefonszám:</strong> ' + (first.telefonszam || '') + '</p>';

                terulet.html(firstHtml);

                data.orarend.forEach(function(entry) {
                    const tr = $('<tr></tr>');

                    $('<td></td>').text(entry.kurzus || '').appendTo(tr);
                    $('<td></td>').text(entry.nap || '').appendTo(tr);
                    $('<td></td>').text(entry.idopont || '').appendTo(tr);
                    $('<td></td>').text(entry.cim || '').appendTo(tr);
                    $('<td></td>').text(entry.telefonszam || '').appendTo(tr);

                    tbody.append(tr);
                });

                scheduleSection.removeClass('hidden');
            }
        })
        .fail(function() {
            error.text('Nem sikerült betölteni az órarendet.');
        });
}

$(function() {
    $('#load-button').on('click', loadSchedule);
});