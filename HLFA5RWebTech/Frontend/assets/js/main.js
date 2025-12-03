const API_BASE_URL = 'https://localhost:8443';

function getCurrentUser() {
    try {
        const raw = localStorage.getItem('authUser');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    try {
        localStorage.setItem('authUser', JSON.stringify(user));
    } catch {}
}

function clearCurrentUser() {
    try {
        localStorage.removeItem('authUser');
    } catch {}
}

// TÉMA BEÁLLÍTÁSOK

function getThemePreference() {
    try {
        const raw = localStorage.getItem('themePreference');
        if (raw === 'system' || raw === 'light') return raw;
    } catch {}
    // ALAP: fix világos
    return 'light';
}

function setThemePreference(pref) {
    try {
        localStorage.setItem('themePreference', pref);
    } catch {}
}

function applyTheme(pref) {
    const root = document.documentElement;

    // system: Windows / OS téma -> data-theme="system"
    // light: fix világos -> nincs data-theme attribútum
    if (pref === 'system') {
        root.setAttribute('data-theme', 'system');
    } else {
        root.removeAttribute('data-theme');
    }
}

function initTheme() {
    const pref = getThemePreference();
    applyTheme(pref);
}

function updateAuthArea() {
    const authLi = document.querySelector('.site-header .auth');
    if (!authLi) return;
    const user = getCurrentUser();
    if (user) {
        const displayName = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() ||
            (user.username || user.email || '');
        authLi.innerHTML = `
      <span class="muted">Bejelentkezve: ${displayName}</span>
      <button type="button" class="btn" data-action="logout">Kijelentkezés</button>
    `;
        const logoutBtn = authLi.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                clearCurrentUser();
                updateAuthArea();
                if (window.location.pathname.startsWith('/auth/')) {
                    window.location.href = '/index.html';
                } else {
                    window.location.reload();
                }
            });
        }
    } else {
        const path = window.location.pathname;
        const onLogin = path.endsWith('/auth/login.html');
        const onRegister = path.endsWith('/auth/register.html');
        const loginClass = onLogin ? 'active' : '';
        const registerClass = 'btn btn-primary' + (onRegister ? ' active' : '');
        authLi.innerHTML = `
      <a class="${loginClass}" href="/auth/login.html">Bejelentkezés</a>
      <a class="${registerClass}" href="/auth/register.html">Regisztráció</a>
    `;
    }
}

function createThemeToggle() {
    const headerInner = document.querySelector('.site-header .header-inner');
    if (!headerInner) return;
    if (document.getElementById('theme-toggle')) return;

    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.type = 'button';
    button.className = 'btn small';
    headerInner.appendChild(button);

    function refreshLabel() {
        const pref = getThemePreference();
        if (pref === 'system') {
            button.textContent = 'Téma: Windows / rendszer';
            button.setAttribute(
                'aria-label',
                'Téma: Windows szerinti, kattints a fix világos módhoz'
            );
        } else {
            button.textContent = 'Téma: világos (fix)';
            button.setAttribute(
                'aria-label',
                'Téma: mindig világos, kattints a Windows szerinti módhoz'
            );
        }
    }

    button.addEventListener('click', () => {
        const current = getThemePreference();
        const next = current === 'system' ? 'light' : 'system';
        setThemePreference(next);
        applyTheme(next);
        refreshLabel();
        // biztos, ami biztos: frissítjük az oldalt is
        window.location.reload();
    });

    refreshLabel();
}

// --- JELSZÓ HASH-ELÉS + ŰRLAP LOGIKA ---

async function hashPasswordToBase64(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hashBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function setMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text || '';
    if (!text) return;
    if (type === 'error') {
        el.style.color = '#b00020';
    } else if (type === 'success') {
        el.style.color = '#2e7d32';
    } else {
        el.style.color = '';
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    if (!email || !password) {
        setMessage('login-message', 'Add meg az e-mail címet és a jelszót.', 'error');
        return;
    }
    setMessage('login-message', 'Bejelentkezés...', null);
    try {
        const passwordHashBase64 = await hashPasswordToBase64(password);
        const response = await fetch(API_BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: passwordHashBase64 })
        });
        if (!response.ok) {
            if (response.status === 400) {
                const data = await response.json().catch(() => null);
                const msg = data && data.errors ?
                    'Hiányos vagy érvénytelen adatok.' :
                    'Hibás bejelentkezési adatok.';
                setMessage('login-message', msg, 'error');
            } else if (response.status === 401) {
                setMessage('login-message', 'Hibás e-mail vagy jelszó.', 'error');
            } else {
                setMessage('login-message', 'Váratlan hiba történt.', 'error');
            }
            return;
        }
        const user = await response.json();
        setCurrentUser(user);
        if (passwordInput) passwordInput.value = '';
        setMessage('login-message', 'Sikeres bejelentkezés, átirányítás...', 'success');
        updateAuthArea();
        window.location.href = '/index.html';
    } catch {
        setMessage('login-message', 'A szerver nem érhető el.', 'error');
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const usernameInput = form.querySelector('#username');
    const firstNameInput = form.querySelector('#firstName');
    const lastNameInput = form.querySelector('#lastName');
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const password2Input = form.querySelector('#password2');
    const username = usernameInput ? usernameInput.value.trim() : '';
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const password2 = password2Input ? password2Input.value : '';
    if (!username || !firstName || !lastName || !email || !password || !password2) {
        setMessage('register-message', 'Minden mezőt ki kell tölteni.', 'error');
        return;
    }
    if (password !== password2) {
        setMessage('register-message', 'A jelszavak nem egyeznek.', 'error');
        return;
    }
    setMessage('register-message', 'Regisztráció folyamatban...', null);
    try {
        const passwordHashBase64 = await hashPasswordToBase64(password);
        const response = await fetch(API_BASE_URL + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                firstName,
                lastName,
                email,
                password: passwordHashBase64
            })
        });
        if (!response.ok) {
            if (response.status === 400) {
                setMessage('register-message', 'Hiányos vagy érvénytelen adatok.', 'error');
            } else if (response.status === 409) {
                setMessage('register-message', 'Ezzel az e-mail címmel már létezik felhasználó.', 'error');
            } else {
                setMessage('register-message', 'Váratlan hiba történt.', 'error');
            }
            return;
        }
        const user = await response.json();
        setCurrentUser(user);
        if (passwordInput) passwordInput.value = '';
        if (password2Input) password2Input.value = '';
        setMessage('register-message', 'Sikeres regisztráció, átirányítás...', 'success');
        updateAuthArea();
        window.location.href = '/index.html';
    } catch {
        setMessage('register-message', 'A szerver nem érhető el.', 'error');
    }
}

async function loadUsersPage() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    const infoEl = document.getElementById('current-user-info');
    const currentUser = getCurrentUser();
    if (infoEl) {
        if (currentUser) {
            const name = ((currentUser.firstName || '') + ' ' + (currentUser.lastName || '')).trim() ||
                currentUser.username || currentUser.email || '';
            infoEl.textContent = name + ' (' + (currentUser.email || '') + ')';
        } else {
            infoEl.textContent = 'A saját adataid megtekintéséhez jelentkezz be.';
        }
    }
    tbody.innerHTML = '';
    try {
        const response = await fetch(API_BASE_URL + '/api/users');
        if (!response.ok) {
            tbody.innerHTML = '<tr><td colspan="4">Hiba történt a felhasználók betöltésekor.</td></tr>';
            return;
        }
        const users = await response.json();
        if (!Array.isArray(users) || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nincs regisztrált felhasználó.</td></tr>';
            return;
        }
        users.forEach(user => {
            const tr = document.createElement('tr');
            const name = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || '–';
            const isCurrent = currentUser && currentUser.id === user.id;
            const nameWithMark = isCurrent ? name + ' (Te)' : name;
            const username = user.username || '–';
            const email = user.email || '–';
            tr.innerHTML = `
        <td>${nameWithMark}</td>
        <td>${username}</td>
        <td>${email}</td>
        <td><button type="button" class="btn btn-primary btn-delete-user" data-user-id="${user.id}">Törlés</button></td>
      `;
            tbody.appendChild(tr);
        });
        tbody.querySelectorAll('.btn-delete-user').forEach(button => {
            button.addEventListener('click', async() => {
                const userId = button.getAttribute('data-user-id');
                const ok = window.confirm('Biztosan törölni szeretnéd ezt a felhasználót?');
                if (!ok) return;
                try {
                    const response = await fetch(API_BASE_URL + '/api/users/' + encodeURIComponent(userId), {
                        method: 'DELETE'
                    });
                    if (response.status === 204) {
                        if (currentUser && currentUser.id === userId) {
                            clearCurrentUser();
                            updateAuthArea();
                        }
                        loadUsersPage();
                    } else if (response.status === 404) {
                        window.alert('A felhasználó nem található.');
                    } else {
                        window.alert('Hiba történt a törlés közben.');
                    }
                } catch {
                    window.alert('A szerver nem érhető el.');
                }
            });
        });
    } catch {
        tbody.innerHTML = '<tr><td colspan="4">A szerver nem érhető el.</td></tr>';
    }
}

function initGalleryVideo() {
    const wrapper = document.querySelector('[data-video-player="gallery"]');
    if (!wrapper) return;

    const video = wrapper.querySelector('video');
    if (!video) return;

    const playPauseBtn = wrapper.querySelector('[data-video-control="play-pause"]');
    const backwardBtn = wrapper.querySelector('[data-video-control="backward"]');
    const forwardBtn = wrapper.querySelector('[data-video-control="forward"]');
    const muteBtn = wrapper.querySelector('[data-video-control="mute"]');
    const volumeSlider = wrapper.querySelector('[data-video-control="volume"]');
    const timeLabel = wrapper.querySelector('[data-video-time]');

    function formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        seconds = Math.max(0, Math.floor(seconds));
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    function updateTime() {
        if (!timeLabel) return;
        const current = video.currentTime || 0;
        const total = isFinite(video.duration) ? video.duration : 0;
        timeLabel.textContent = formatTime(current) + ' / ' + formatTime(total);
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', () => {
            playPauseBtn.textContent = 'Szünet';
        });

        video.addEventListener('pause', () => {
            playPauseBtn.textContent = 'Lejátszás';
        });
    }

    if (backwardBtn) {
        backwardBtn.addEventListener('click', () => {
            const target = (video.currentTime || 0) - 10;
            video.currentTime = Math.max(0, target);
        });
    }

    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            const duration = isFinite(video.duration) ? video.duration : 0;
            const target = (video.currentTime || 0) + 10;
            video.currentTime = duration ? Math.min(duration, target) : target;
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            muteBtn.textContent = video.muted ? 'Hang bekapcs.' : 'Némítás';
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const value = parseFloat(volumeSlider.value);
            if (!isNaN(value)) {
                video.volume = value;
                if (value === 0) {
                    video.muted = true;
                    if (muteBtn) {
                        muteBtn.textContent = 'Hang bekapcs.';
                    }
                } else {
                    video.muted = false;
                    if (muteBtn) {
                        muteBtn.textContent = 'Némítás';
                    }
                }
            }
        });
    }

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);
    updateTime();
}

// Elsőként alkalmazzuk a témát, még mielőtt a DOM content load futna
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', (!expanded).toString());
            document.body.classList.toggle('nav-open');
        });
    }

    document.querySelectorAll('.password-field').forEach((wrapper) => {
        const input = wrapper.querySelector('input[type="password"], input[type="text"]');
        const toggleBtn = wrapper.querySelector('[data-password-toggle]');
        if (!input || !toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';

            toggleBtn.setAttribute(
                'aria-label',
                isHidden ? 'Jelszó elrejtése' : 'Jelszó mutatása'
            );

            const icon = toggleBtn.querySelector('.password-toggle-icon');
            if (icon) {
                icon.textContent = isHidden ? '🙈' : '👁';
            }
        });
    });

    updateAuthArea();
    createThemeToggle();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const currentUser = getCurrentUser();

    if ((loginForm || registerForm) && currentUser) {
        window.location.href = '/index.html';
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    const usersTableBody = document.getElementById('users-tbody');
    if (usersTableBody) {
        loadUsersPage();
    }

    initGalleryVideo();
});