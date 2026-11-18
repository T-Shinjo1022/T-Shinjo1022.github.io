/* Navigation and 2D illusion interactions. */
// ---------- Mobile navigation ----------
const nav = document.getElementById('navigation'), menu = document.getElementById('menuButton');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '✕' : '☰'; });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = '☰'; }));
// ---------- Two-dimensional optical illusions ----------
for (const id of ['clusterOne', 'clusterTwo']) {
    const c = document.getElementById(id);
    for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        s.className = 'outer';
        const angle = i * Math.PI / 4, rad = id === 'clusterOne' ? 73 : 61;
        s.style.setProperty('--x', Math.cos(angle) * rad + 'px');
        s.style.setProperty('--y', Math.sin(angle) * rad + 'px');
        c.appendChild(s);
    }
}
document.getElementById('ebbingToggle').addEventListener('click', function () { const on = document.getElementById('clusterOne').classList.toggle('no-surround'); document.getElementById('clusterTwo').classList.toggle('no-surround', on); this.setAttribute('aria-pressed', String(on)); this.textContent = on ? '周囲の円を表示 ↗' : '周囲の円を隠す ↗'; });
document.getElementById('brightnessToggle').addEventListener('click', function () { const on = document.getElementById('brightness').classList.toggle('same'); this.setAttribute('aria-pressed', String(on)); this.textContent = on ? '元の背景に戻す ↗' : '背景色をそろえる ↗'; });
