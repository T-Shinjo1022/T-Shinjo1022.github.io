/* Osa Lab — perspective and size perception demo.
 * The two cuboids are shown by their FRONT FACES only, so the viewer can
 * compare their apparent heights without seeing the top or side surfaces.
 */
try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');

    const REFERENCE_HEIGHT = 720;
    const stage = document.getElementById('demoStage');
    const hero = document.getElementById('heroScene');

    const makeRenderer = () => {
        const result = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        result.setPixelRatio(1);
        result.outputColorSpace = THREE.SRGBColorSpace;
        result.toneMapping = THREE.ACESFilmicToneMapping;
        result.toneMappingExposure = 1.45;
        return result;
    };

    const renderer = makeRenderer();
    const heroRenderer = makeRenderer();
    stage.prepend(renderer.domElement);
    hero.prepend(heroRenderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb4c6d7);
    scene.fog = new THREE.Fog(0xb4c6d7, 24, 46);

    const emptyScene = new THREE.Scene();
    emptyScene.background = new THREE.Color(0xe5edf8);

    const camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 100);
    const heroCamera = new THREE.PerspectiveCamera(65, 16 / 10, 0.1, 100);
    const CAMERA_HEIGHT = 1.8;
    for (const cam of [camera, heroCamera]) {
        cam.position.set(0, CAMERA_HEIGHT, 0);
        cam.lookAt(0, CAMERA_HEIGHT, -12);
    }

    const mat = (color, roughness = 0.84, metalness = 0) =>
        new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const floorMat = mat(0xc1c9d0);
    const wallL = mat(0xe3e9ef);
    const wallR = mat(0xe6ebf2);
    const ceilMat = mat(0xf4f7fb);
    const trim = mat(0x879bb1);
    const frame = mat(0x8e9fb0);
    const door = mat(0xb3c3d2);
    const panel = mat(0xd2deea);
    const joint = mat(0x9ba8b7);

    function lighting(target) {
        target.add(new THREE.HemisphereLight(0xffffff, 0x8b9db8, 2.7));
        const key = new THREE.DirectionalLight(0xffffff, 2.0);
        key.position.set(-6, 10, 3);
        target.add(key);
        const fill = new THREE.DirectionalLight(0xb6d5ff, 1.1);
        fill.position.set(5, 4, -17);
        target.add(fill);
    }
    lighting(scene);

    function box(parent, w, h, d, x, y, z, material) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }

    const environment = new THREE.Group();
    scene.add(environment);
    const hallW = 7.5;
    const hallH = 3.7;
    const len = 40;
    box(environment, hallW, 0.19, len, 0, -0.12, -len / 2, floorMat);
    box(environment, 0.18, hallH, len, -hallW / 2, hallH / 2, -len / 2, wallL);
    box(environment, 0.18, hallH, len, hallW / 2, hallH / 2, -len / 2, wallR);
    box(environment, hallW, 0.16, len, 0, hallH + 0.08, -len / 2, ceilMat);
    box(environment, hallW, hallH, 0.1, 0, hallH / 2, -len, mat(0xb9c9d8));

    // The grid, doors and ceiling fixtures provide distance cues.
    for (let z = -0.25; z > -len; z -= 1.5) {
        box(environment, hallW, 0.005, 0.014, 0, 0.008, z, joint);
        for (let x = -hallW / 2 + 0.4; x < hallW / 2; x += 1) {
            box(environment, 0.012, 0.004, 1.5, x, 0.01, z - 0.75, joint);
        }
    }
    for (const side of [-1, 1]) {
        box(environment, 0.045, 0.11, len, side * (hallW / 2 - 0.12), 0.09, -len / 2, trim);
        box(environment, 0.04, 0.05, len, side * (hallW / 2 - 0.12), 1.24, -len / 2, trim);
        box(environment, 0.04, 0.05, len, side * (hallW / 2 - 0.12), hallH - 0.31, -len / 2, trim);
        for (let z = -4; z > -len + 2; z -= 5.1) {
            const x = side * (hallW / 2 - 0.145);
            box(environment, 0.038, 2.48, 0.07, x, 1.24, z - 1.08, frame);
            box(environment, 0.038, 2.48, 0.07, x, 1.24, z + 1.08, frame);
            box(environment, 0.038, 0.07, 2.25, x, 2.48, z, frame);
            box(environment, 0.025, 2.34, 2.06, x, 1.19, z, door);
            box(environment, 0.012, 1.5, 1.46, x - side * 0.022, 1.30, z, panel);
            box(environment, 0.1, 0.04, 0.13, x - side * 0.09, 1.08, z - 0.55, mat(0xc4a56f, 0.35, 0.5));
        }
    }
    for (let z = -2; z > -len; z -= 3.7) {
        box(environment, hallW, 0.045, 0.045, 0, hallH - 0.04, z, trim);
        box(environment, 1.8, 0.02, 0.45, 0, hallH - 0.02, z - 0.9,
            new THREE.MeshBasicMaterial({ color: 0xffffff }));
    }

    // Only draw each cuboid's front face: no visible top or side surfaces.
    // The front faces still have different 3D distances and are perspective-projected.
    const faceGeometry = new THREE.PlaneGeometry(1, 1);
    const outlineGeometry = new THREE.EdgesGeometry(faceGeometry);
    function makeFace(color, outlineColor) {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(faceGeometry,
            new THREE.MeshBasicMaterial({ color, side: THREE.FrontSide })));
        group.add(new THREE.LineSegments(outlineGeometry,
            new THREE.LineBasicMaterial({ color: outlineColor })));
        return group;
    }
    const blue = makeFace(0x2179f9, 0x0b397d);
    const orange = makeFace(0xff9039, 0x96410b);
    scene.add(blue, orange);
    const emptyBlue = blue.clone();
    const emptyOrange = orange.clone();
    emptyScene.add(emptyBlue, emptyOrange);

    const control = {
        near: document.getElementById('nearRange'),
        far: document.getElementById('farRange'),
        px: document.getElementById('pxRange'),
        fov: document.getElementById('fovRange')
    };
    let background = true;
    let match = true;

    // The faces are centered at the SAME screen height. Their centers are
    // offset by half a face width, so their silhouettes overlap by ~50%.
    // Position offsets are converted from pixels to world units at each depth.
    function positionFace(face, copy, depth, apparentPx, sign, focalPx) {
        const worldHeight = apparentPx * depth / focalPx;
        const worldWidth = worldHeight * 0.35;
        const horizontalOffsetPx = apparentPx * 0.35 * 0.25;
        const x = sign * horizontalOffsetPx * depth / focalPx;
        const centerY = CAMERA_HEIGHT;
        for (const group of [face, copy]) {
            group.position.set(x, centerY, -depth);
            group.scale.set(worldWidth, worldHeight, 1);
        }
    }

    function fitCanvas(targetRenderer, container, cam) {
        const width = Math.max(1, Math.round(container.clientWidth));
        const height = Math.max(1, Math.round(container.clientHeight));
        if (targetRenderer.domElement.width !== width || targetRenderer.domElement.height !== height) {
            targetRenderer.setSize(width, height, false);
        }
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
    }

    function render() {
        fitCanvas(renderer, stage, camera);
        fitCanvas(heroRenderer, hero, heroCamera);
        const nearDistance = Number(control.near.value);
        const farDistance = Number(control.far.value);
        const requestedPx = Number(control.px.value);
        const angle = Number(control.fov.value);
        camera.fov = angle;
        heroCamera.fov = angle;
        camera.updateProjectionMatrix();
        heroCamera.updateProjectionMatrix();

        const canvasHeight = renderer.domElement.height;
        const focalPx = canvasHeight / (2 * Math.tan(THREE.MathUtils.degToRad(angle) / 2));
        const requestedScreenPx = requestedPx * canvasHeight / REFERENCE_HEIGHT;

        // Keep both faces entirely inside the hallway, even at the farthest
        // slider position and the widest FOV. Scaling both together preserves
        // equal apparent heights in the matching mode.
        const margin = 0.25;
        const maxWorldHeight = 2 * Math.min(CAMERA_HEIGHT - margin, hallH - CAMERA_HEIGHT - margin);
        const largestDepthForHeight = match ? farDistance : nearDistance;
        const maximumScreenPx = maxWorldHeight * focalPx / largestDepthForHeight;
        const actualScreenPx = Math.min(requestedScreenPx, maximumScreenPx);
        const capped = actualScreenPx < requestedScreenPx - 0.01;

        positionFace(blue, emptyBlue, nearDistance, actualScreenPx, -1, focalPx);
        const farApparentPx = match ? actualScreenPx : actualScreenPx * nearDistance / farDistance;
        positionFace(orange, emptyOrange, farDistance, farApparentPx, 1, focalPx);

        for (const [key, value, suffix, digits] of [
            ['near', nearDistance, ' m', 1],
            ['far', farDistance, ' m', 1],
            ['px', requestedPx, ' px', 0],
            ['fov', angle, '°', 0]
        ]) {
            document.getElementById(key + 'Out').textContent = value.toFixed(digits) + suffix;
        }

        const actualReferencePx = Math.round(actualScreenPx * REFERENCE_HEIGHT / canvasHeight);
        const status = match
            ? `画面上の高さ：両方とも約 ${actualReferencePx} px（1280 × 720基準）`
            : '3D空間で同じ実寸の高さに設定';
        document.getElementById('experimentStatus').textContent = capped
            ? `${status} ※天井を超えないよう自動縮小しています。`
            : status;
        document.getElementById('sceneTitle').textContent = background ? '廊下の背景あり' : '背景なし';

        renderer.render(background ? scene : emptyScene, camera);
        heroRenderer.render(scene, heroCamera);
    }

    Object.values(control).forEach(input => input.addEventListener('input', render));
    function active(button, enabled) {
        button.classList.toggle('active', enabled);
        button.setAttribute('aria-pressed', String(enabled));
    }
    const withBtn = document.getElementById('withBackground');
    const withoutBtn = document.getElementById('withoutBackground');
    withBtn.addEventListener('click', () => {
        background = true;
        active(withBtn, true);
        active(withoutBtn, false);
        render();
    });
    withoutBtn.addEventListener('click', () => {
        background = false;
        active(withBtn, false);
        active(withoutBtn, true);
        render();
    });
    const matchBtn = document.getElementById('toggleMatch');
    matchBtn.addEventListener('click', () => {
        match = !match;
        active(matchBtn, match);
        matchBtn.textContent = match ? '表示高さをそろえる ✓' : '3D空間で同じ高さにする';
        render();
    });
    document.getElementById('resetDemo').addEventListener('click', () => {
        control.near.value = 5;
        control.far.value = 13;
        control.px.value = 130;
        control.fov.value = 65;
        background = true;
        match = true;
        active(withBtn, true);
        active(withoutBtn, false);
        active(matchBtn, true);
        matchBtn.textContent = '表示高さをそろえる ✓';
        render();
    });
    document.getElementById('saveDemo').addEventListener('click', () => {
        render();
        const link = document.createElement('a');
        link.download = 'osa-lab-perspective.png';
        link.href = renderer.domElement.toDataURL('image/png');
        link.click();
    });

    const resizeWatcher = new ResizeObserver(render);
    resizeWatcher.observe(stage);
    resizeWatcher.observe(hero);
    window.addEventListener('resize', render);
    render();
    stage.classList.add('is-loaded');
} catch (error) {
    console.error('3D scene initialization failed:', error);
    const loading = document.getElementById('loading');
    if (loading) loading.textContent = '3Dを表示できません。ネット接続とWebGL対応を確認してください。';
}
