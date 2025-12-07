const jsonUrl = 'HLFA5R_orarend.json';

async function loadSchedule() {
    const error = document.getElementById('error-message');
    const studentInfo = document.getElementById('student-info');
    const scheduleSection = document.getElementById('schedule-section');
    const tbody = document.getElementById('schedule-body');

    error.textContent = '';
    tbody.innerHTML = '';

    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('JSON load error: ' + response.status);
        }

        const data = await response.json();

        if (data.hallgato && data.hallgato.nev && data.hallgato.neptun) {
            studentInfo.textContent =
                data.hallgato.nev + ' – Neptun: ' + data.hallgato.neptun;
        }

        if (Array.isArray(data.orarend)) {
            data.orarend.forEach(function(entry) {
                const tr = document.createElement('tr');

                const tdKurzus = document.createElement('td');
                tdKurzus.textContent = entry.kurzus || '';
                tr.appendChild(tdKurzus);

                const tdNap = document.createElement('td');
                tdNap.textContent = entry.nap || '';
                tr.appendChild(tdNap);

                const tdIdo = document.createElement('td');
                tdIdo.textContent = entry.idopont || '';
                tr.appendChild(tdIdo);

                const tdCim = document.createElement('td');
                tdCim.textContent = entry.cim || '';
                tr.appendChild(tdCim);

                const tdTel = document.createElement('td');
                tdTel.textContent = entry.telefonszam || '';
                tr.appendChild(tdTel);

                tbody.appendChild(tr);
            });
        }

        scheduleSection.classList.remove('hidden');
    } catch (e) {
        error.textContent = 'Nem sikerült betölteni az órarendet.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('load-button');
    button.addEventListener('click', loadSchedule);
});