const modoclaro = document.getElementById('modoclaro');
const modoescuro = document.getElementById('modoescuro');
const root = document.documentElement;

function setTheme() {
    if (modoescuro.checked) {
        localStorage.setItem('theme', 'dark');
        root.style.setProperty('--text-color', '#e2e2e2');
        root.style.setProperty('--text-light', '#fcfcfc');
        root.style.setProperty('--bg-color', '#424242');
        root.style.setProperty('--border-color', '#555');
        root.style.setProperty('--white', '#2c2c2c');
        root.style.setProperty('--filter', 'invert(1)');
    } else {
        localStorage.setItem('theme', 'light');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--text-light', '#555');
        root.style.setProperty('--bg-color', '#f4f4f4');
        root.style.setProperty('--border-color', '#ccc');
        root.style.setProperty('--white', 'white');
        root.style.setProperty('--filter', 'none');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        modoescuro.checked = true;
    }
    setTheme();
}

modoclaro.addEventListener('change', setTheme);
modoescuro.addEventListener('change', setTheme);

loadTheme();