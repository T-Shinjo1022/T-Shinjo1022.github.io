/* Three.js hallway and cuboid perspective experiment.
 * Camera, geometry, UI controls, and image export live in this file.
 */
try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    const W = 1280, H = 720;
    const stage = document.getElementById('demoStage'), hero = document.getElementById('heroScene');
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.prepend(renderer.domElement);
    const heroRenderer = new THREE.WebGLRenderer({ antialias: true });
    heroRenderer.setPixelRatio(1);
    heroRenderer.outputColorSpace = THREE.SRGBColorSpace;
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.45;
    hero.prepend(heroRenderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb4c6d7);
    scene.fog = new THREE.Fog(0xb4c6d7, 24, 46);
    const emptyScene = new THREE.Scene();
    emptyScene.background = new THREE.Color(0xe5edf8);
    const camera = new THREE.PerspectiveCamera(65, W / H, .1, 100);
    camera.position.set(0, 1.65, 0);
    camera.lookAt(0, 1.65, -12);
    const heroCamera = new THREE.PerspectiveCamera(65, 16 / 10, .1, 100);
    heroCamera.position.set(0, 1.65, 0);
    heroCamera.lookAt(0, 1.65, -12);
    const mat = (c, r = .84, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const floorMat = mat(0xc1c9d0), wallL = mat(0xe3e9ef), wallR = mat(0xe6ebf2), ceilMat = mat(0xf4f7fb), trim = mat(0x879bb1), frame = mat(0x8e9fb0), door = mat(0xb3c3d2), panel = mat(0xd2deea), joint = mat(0x9ba8b7);
    const lighting = (s) => { s.add(new THREE.HemisphereLight(0xffffff, 0x8b9db8, 2.7)); let d = new THREE.DirectionalLight(0xffffff, 2.0); d.position.set(-6, 10, 3); s.add(d); let fill = new THREE.DirectionalLight(0xb6d5ff, 1.1); fill.position.set(5, 4, -17); s.add(fill); };
    lighting(scene);
    lighting(emptyScene);
    function box(parent, w, h, d, x, y, z, material, shadow = false) { let o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material); o.position.set(x, y, z); o.receiveShadow = true; o.castShadow = shadow; parent.add(o); return o; }
    const environment = new THREE.Group();
    scene.add(environment);
    const hallW = 7.5, hallH = 3.7, len = 40;
    box(environment, hallW, .19, len, 0, -.12, -len / 2, floorMat);
    box(environment, .18, hallH, len, -hallW / 2, hallH / 2, -len / 2, wallL);
    box(environment, .18, hallH, len, hallW / 2, hallH / 2, -len / 2, wallR);
    box(environment, hallW, .16, len, 0, hallH + .08, -len / 2, ceilMat);
    box(environment, hallW, hallH, .1, 0, hallH / 2, -len, mat(0xb9c9d8));
    // Floor grid, trim and wall doors create strong converging perspective cues
    for (let z = -.25; z > -len; z -= 1.5) {
        box(environment, hallW, .005, .014, 0, .008, z, joint);
        for (let x = -hallW / 2 + .4; x < hallW / 2; x += 1) {
            box(environment, .012, .004, 1.5, x, .01, z - .75, joint);
        }
    }
    for (const side of [-1, 1]) {
        box(environment, .045, .11, len, side * (hallW / 2 - .12), .09, -len / 2, trim);
        box(environment, .04, .05, len, side * (hallW / 2 - .12), 1.24, -len / 2, trim);
        box(environment, .04, .05, len, side * (hallW / 2 - .12), hallH - .31, -len / 2, trim);
        for (let z = -4; z > -len + 2; z -= 5.1) {
            const x = side * (hallW / 2 - .145);
            box(environment, .038, 2.48, .07, x, 1.24, z - 1.08, frame);
            box(environment, .038, 2.48, .07, x, 1.24, z + 1.08, frame);
            box(environment, .038, .07, 2.25, x, 2.48, z, frame);
            box(environment, .025, 2.34, 2.06, x, 1.19, z, door);
            box(environment, .012, 1.5, 1.46, x - side * .022, 1.30, z, panel);
            box(environment, .1, .04, .13, x - side * .09, 1.08, z - .55, mat(0xc4a56f, .35, .5));
        }
    }
    for (let z = -2; z > -len; z -= 3.7) {
        box(environment, hallW, .045, .045, 0, hallH - .04, z, trim);
        box(environment, 1.8, .02, .45, 0, hallH - .02, z - .9, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    }
    // Exact matching is based on front-face depth and pinhole projection.
    const boxGeom = new THREE.BoxGeometry(1, 1, 1);
    const nearMat = mat(0x2179f9, .45), farMat = mat(0xff9039, .45);
    function cuboid(material) { const g = new THREE.Group(); const o = new THREE.Mesh(boxGeom, material); o.castShadow = true; o.receiveShadow = true; g.add(o); const e = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeom), new THREE.LineBasicMaterial({ color: 0x173457, transparent: true, opacity: .55 })); g.add(e); scene.add(g); return { g, o, e }; }
    const blue = cuboid(nearMat), orange = cuboid(farMat);
    emptyScene.add(blue.g.clone());
    emptyScene.add(orange.g.clone()); // replaced below with shared geometry/material state
    const emptyBlue = emptyScene.children[emptyScene.children.length - 2], emptyOrange = emptyScene.children[emptyScene.children.length - 1];
    const control = { near: document.getElementById('nearRange'), far: document.getElementById('farRange'), px: document.getElementById('pxRange'), fov: document.getElementById('fovRange') };
    let background = true, match = true;
    function positionBlock(block, clone, depth, pix, offset, fPx) { const height = pix * depth / fPx; const width = height * .35, thickness = .13; const z = -depth - thickness / 2; for (const group of [block.g, clone]) {
        group.children.forEach(o => { o.scale.set(width, height, thickness); o.position.set(offset, height / 2, z); });
    } }
    function fitCanvas(canvasRenderer, container, cam) {
        const rect = container.getBoundingClientRect();
        const width = Math.max(1, Math.round(container.clientWidth));
        const height = Math.max(1, Math.round(container.clientHeight));
        if (canvasRenderer.domElement.width !== width || canvasRenderer.domElement.height !== height) {
            canvasRenderer.setSize(width, height, false);
        }
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
    }
    function render() {
        fitCanvas(renderer, stage, camera);
        fitCanvas(heroRenderer, hero, heroCamera);
        const n = +control.near.value, f = +control.far.value, p = +control.px.value, angle = +control.fov.value;
        camera.fov = angle;
        camera.updateProjectionMatrix();
        heroCamera.fov = angle;
        heroCamera.updateProjectionMatrix();
        const currentHeight = renderer.domElement.height;
        const fPx = currentHeight / (2 * Math.tan(THREE.MathUtils.degToRad(angle) / 2)); // Convert the 1280x720 reference pixel height to the actual display pixel height.
        const scaledP = p * currentHeight / H;
        positionBlock(blue, emptyBlue, n, scaledP, -1.55, fPx);
        positionBlock(orange, emptyOrange, f, match ? scaledP : scaledP * n / f, 1.55, fPx);
        for (const [key, val, suffix, dec] of [['near', n, ' m', 1], ['far', f, ' m', 1], ['px', p, ' px', 0], ['fov', angle, '°', 0]])
            document.getElementById(key + 'Out').textContent = val.toFixed(dec) + suffix;
        document.getElementById('experimentStatus').textContent = match ? `画面上の高さ：両方とも ${p} px（1280 × 720基準）` : '3D空間で同じ実寸の高さに設定';
        document.getElementById('sceneTitle').textContent = background ? '廊下の背景あり' : '背景なし';
        renderer.render(background ? scene : emptyScene, camera);
        heroRenderer.render(scene, heroCamera);
    }
    Object.values(control).forEach(c => c.addEventListener('input', render));
    function active(btn, v) { btn.classList.toggle('active', v); btn.setAttribute('aria-pressed', String(v)); }
    const withBtn = document.getElementById('withBackground'), withoutBtn = document.getElementById('withoutBackground');
    withBtn.addEventListener('click', () => { background = true; active(withBtn, true); active(withoutBtn, false); render(); });
    withoutBtn.addEventListener('click', () => { background = false; active(withBtn, false); active(withoutBtn, true); render(); });
    const matchBtn = document.getElementById('toggleMatch');
    matchBtn.addEventListener('click', () => { match = !match; active(matchBtn, match); matchBtn.textContent = match ? '表示高さをそろえる ✓' : '3D空間で同じ高さにする'; render(); });
    document.getElementById('resetDemo').addEventListener('click', () => { control.near.value = 5; control.far.value = 13; control.px.value = 130; control.fov.value = 65; background = true; match = true; active(withBtn, true); active(withoutBtn, false); active(matchBtn, true); matchBtn.textContent = '表示高さをそろえる ✓'; render(); });
    document.getElementById('saveDemo').addEventListener('click', () => { render(); const a = document.createElement('a'); a.download = 'osa-lab-perspective.png'; a.href = renderer.domElement.toDataURL('image/png'); a.click(); });
    const resizeWatcher = new ResizeObserver(() => render());
    resizeWatcher.observe(stage);
    resizeWatcher.observe(hero);
    window.addEventListener('resize', render);
    render();
    stage.classList.add('is-loaded');
}
catch (error) {
    console.error('3D scene initialization failed:', error);
    const loading = document.getElementById('loading');
    if (loading)
        loading.textContent = '3Dを表示できません。ネット接続とWebGL対応を確認してください。';
}
