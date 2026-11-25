/* Shared mobile navigation. Extracted from the existing main.js; no HOME-only code. */
(() => {
    const nav = document.getElementById('navigation');
    const menu = document.getElementById('menuButton');
    if (!nav || !menu) return;

    function setOpen(open) {
        nav.classList.toggle('open', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        menu.textContent = open ? '✕' : '☰';
    }

    menu.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            setOpen(false);
            menu.focus();
        }
    });
})();
