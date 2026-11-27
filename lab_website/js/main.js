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

// 長錯視：問題と解答を切り替える。
const roadToggle = document.getElementById('roadAngleToggle');
const roadImage = document.getElementById('roadAngleImage');
const roadCaption = document.getElementById('roadAngleCaption');
const roadAnswer = document.getElementById('roadAngleAnswer');

if (roadToggle && roadImage && roadCaption && roadAnswer) {
    const answerImage = new Image();
    answerImage.src = 'images/home/road-angle-answer.png';
    let showingAnswer = false;

    roadToggle.addEventListener('click', () => {
        showingAnswer = !showingAnswer;
        roadImage.src = showingAnswer
            ? answerImage.src
            : 'images/home/road-angle.png';
        roadImage.alt = showingAnswer
            ? '道路の左右の境界を示す直線と、約110度の角度。'
            : '道路の写真。曲線と疑問符で角度を示しています。';
        roadCaption.textContent = showingAnswer
            ? '画像上の角度は約110°です。'
            : '道路の左右の境界が作る角度を予想してください。';
        roadAnswer.hidden = !showingAnswer;
        roadToggle.setAttribute('aria-expanded', String(showingAnswer));
        roadToggle.textContent = showingAnswer ? '問題に戻る ↺' : '答えを見る →';
    });
}
