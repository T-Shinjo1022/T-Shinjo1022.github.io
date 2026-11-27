/* Mobile navigation. HOMEの旧2種類の錯視に関する処理は削除。 */
const nav = document.getElementById('navigation');
const menu = document.getElementById('menuButton');

if (nav && menu) {
    function setMenu(open) {
        nav.classList.toggle('open', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        menu.textContent = open ? '✕' : '☰';
    }

    menu.addEventListener('click', () => {
        setMenu(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => setMenu(false));
    });
}
