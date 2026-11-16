/* 全ページ共通：モバイルナビゲーションと、制作中リンクの案内 */
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
    };
    toggle.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }
  const toast = document.getElementById('planned-toast');
  if (toast) {
    let hideTimer;
    document.querySelectorAll('a[data-planned]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        toast.hidden = false;
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => { toast.hidden = true; }, 3500);
      });
    });
  }
})();
