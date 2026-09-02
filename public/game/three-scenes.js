(() => {
  'use strict';
  if (typeof THREE === 'undefined') return;

  function fitRenderer(renderer, canvas, camera) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(w * dpr), targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
    }
    return { w, h };
  }

  function hexToNum(hex) { return parseInt(String(hex).replace('#', ''), 16) || 0xffffff; }

  // ================= SHIP ASSEMBLY BAY 3D =================
  function initShipScene() {
    const canvas = document.querySelector('#assemblyCanvas3D');
    const stage = document.querySelector('#assemblyStage');
    if (!canvas || !stage) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch { return; }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.9, 6.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x2a3a4a, 1.2));
    const key = new THREE.PointLight(0x65f4ff, 3.4, 22);
    key.position.set(3, 3, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xb871ff, 2.6, 22);
    rim.position.set(-3.5, -1.2, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.55);
    fill.position.set(0, 6, 3);
    scene.add(fill);

    const shipGroup = new THREE.Group();
    scene.add(shipGroup);

    function buildShip(shipState) {
      while (shipGroup.children.length) {
        const child = shipGroup.children.pop();
        child.geometry?.dispose?.();
        child.material?.dispose?.();
      }
      const colors = shipState.skinColors || { outer: '#65f4ff', inner: '#b6fbff', core: '#123d88' };
      const outer = hexToNum(colors.outer), inner = hexToNum(colors.inner), core = hexToNum(colors.core);
      const hitbox = shipState.hullHitbox || 1;
      const parts = shipState.parts || {};

      const profilePts = [
        new THREE.Vector2(0, -1.95),
        new THREE.Vector2(0.26, -1.15),
        new THREE.Vector2(0.34, 0.15),
        new THREE.Vector2(0.24, 0.95),
        new THREE.Vector2(0, 1.25),
      ];
      const hullGeo = new THREE.LatheGeometry(profilePts, 28);
      const hullMat = new THREE.MeshStandardMaterial({ color: core, metalness: 0.4, roughness: 0.32, emissive: outer, emissiveIntensity: 0.1 });
      const hullMesh = new THREE.Mesh(hullGeo, hullMat);
      hullMesh.scale.x = hitbox;
      shipGroup.add(hullMesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(hullGeo, 18),
        new THREE.LineBasicMaterial({ color: outer, transparent: true, opacity: 0.75 })
      );
      edges.scale.x = hitbox;
      shipGroup.add(edges);

      if (parts.wings) {
        const wingGeo = new THREE.BoxGeometry(1.6, 0.05, 0.64);
        const wingMat = new THREE.MeshStandardMaterial({ color: core, metalness: 0.35, roughness: 0.4, emissive: outer, emissiveIntensity: 0.14 });
        for (const side of [-1, 1]) {
          const wing = new THREE.Mesh(wingGeo, wingMat);
          wing.position.set(side * 0.98, -0.1, 0.05);
          wing.rotation.z = side * 0.12;
          shipGroup.add(wing);
          const wingEdge = new THREE.LineSegments(new THREE.EdgesGeometry(wingGeo), new THREE.LineBasicMaterial({ color: outer, transparent: true, opacity: 0.5 }));
          wingEdge.position.copy(wing.position);
          wingEdge.rotation.copy(wing.rotation);
          shipGroup.add(wingEdge);
        }
      }
      if (parts.core) {
        const coreGeo = new THREE.SphereGeometry(0.22, 20, 20);
        const coreMat = new THREE.MeshStandardMaterial({ color: inner, emissive: 0x65f4ff, emissiveIntensity: 1.6, roughness: 0.2 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.set(0, 0.15, 0.2);
        shipGroup.add(coreMesh);
        const glow = new THREE.PointLight(0x65f4ff, 1.6, 5);
        glow.position.copy(coreMesh.position);
        shipGroup.add(glow);
      }
      if (parts.cannons) {
        const cannonGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.95, 10);
        const cannonMat = new THREE.MeshStandardMaterial({ color: 0x11161e, metalness: 0.65, roughness: 0.3, emissive: outer, emissiveIntensity: 0.25 });
        for (const side of [-1, 1]) {
          const cannon = new THREE.Mesh(cannonGeo, cannonMat);
          cannon.position.set(side * 0.34, -0.55, 0.9);
          cannon.rotation.x = Math.PI / 2;
          shipGroup.add(cannon);
        }
      }
      if (parts.armor) {
        const armorGeo = new THREE.BoxGeometry(0.14, 0.9, 0.5);
        const armorMat = new THREE.MeshStandardMaterial({ color: inner, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.88 });
        for (const side of [-1, 1]) {
          const plate = new THREE.Mesh(armorGeo, armorMat);
          plate.position.set(side * 0.42, 0, -0.15);
          shipGroup.add(plate);
        }
      }
    }

    let t = 0;
    function frame() {
      requestAnimationFrame(frame);
      if (canvas.offsetParent === null) return;
      t += 0.011;
      shipGroup.rotation.y = t;
      shipGroup.position.y = Math.sin(t * 1.3) * 0.07;
      const { w, h } = fitRenderer(renderer, canvas, camera);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

    function sync() {
      if (!window.SV_SHIP_STATE) return;
      buildShip(window.SV_SHIP_STATE);
      stage.classList.add('mode-3d');
    }
    window.addEventListener('sv-ship-updated', sync);
    sync();
  }

  // ================= MOTHER BASE ASTRONAUT 3D =================
  function initAstronautScene() {
    const canvas = document.querySelector('#astronautCanvas3D');
    const shell = document.querySelector('.game-shell');
    if (!canvas || !shell) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch { return; }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x2a3a4a, 1.3));
    const overhead = new THREE.DirectionalLight(0xffffff, 0.7);
    overhead.position.set(0.4, 1, 1);
    scene.add(overhead);

    const suitColors = { cyan: '#65f4ff', pink: '#ff6de5', gold: '#ffe66d' };
    const rig = {};
    // outerGroup carries screen position + facing turn (rotation around the vertical/Z axis).
    // group (inner) carries a constant backward tilt in the character's OWN local frame, so the
    // tilt rotates together with the character instead of skewing sideways when it turns to face left/right.
    const outerGroup = new THREE.Group();
    scene.add(outerGroup);
    const group = new THREE.Group();
    group.rotation.x = -0.1;
    outerGroup.add(group);

    let glow = null;

    function buildAstronaut(tint) {
      while (group.children.length) {
        const child = group.children.pop();
        child.geometry?.dispose?.();
        child.material?.dispose?.();
      }
      const color = hexToNum(suitColors[tint] || suitColors.cyan);
      const suitMat = new THREE.MeshStandardMaterial({ color: 0x0d1a22, metalness: 0.2, roughness: 0.55, emissive: color, emissiveIntensity: 0.22 });
      const trimMat = new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.35, emissive: color, emissiveIntensity: 0.5 });
      const visorMat = new THREE.MeshStandardMaterial({ color: 0x9fe9ff, metalness: 0.1, roughness: 0.15, emissive: 0x7fd8ea, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 });

      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(13, 20, 4, 10), suitMat);
      torso.position.set(0, 10, 0);
      group.add(torso);
      rig.torso = torso;

      const belt = new THREE.Mesh(new THREE.TorusGeometry(13.5, 1.6, 6, 16), trimMat);
      belt.position.set(0, -1, 0);
      belt.rotation.x = Math.PI / 2;
      group.add(belt);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(15, 22, 18), suitMat);
      helmet.position.set(0, 40, 0);
      group.add(helmet);
      const visor = new THREE.Mesh(new THREE.SphereGeometry(11.5, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), visorMat);
      visor.position.set(0, 41, 8);
      visor.rotation.x = -0.3;
      group.add(visor);
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12, 6), trimMat);
      antenna.position.set(6, 53, -2);
      antenna.rotation.z = -0.35;
      group.add(antenna);
      const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), trimMat);
      antennaTip.position.set(9, 58, -4);
      group.add(antennaTip);
      rig.antennaTip = antennaTip;

      const backpack = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 8), suitMat);
      backpack.position.set(0, 24, -11);
      group.add(backpack);

      const armGeo = new THREE.CapsuleGeometry(3.4, 16, 4, 8);
      const legGeo = new THREE.CapsuleGeometry(3.8, 18, 4, 8);
      const armL = new THREE.Mesh(armGeo, suitMat); armL.position.set(-16, 6, 0); armL.rotation.z = 0.25; group.add(armL);
      const armR = new THREE.Mesh(armGeo, suitMat); armR.position.set(16, 6, 0); armR.rotation.z = -0.25; group.add(armR);
      const legL = new THREE.Mesh(legGeo, suitMat); legL.position.set(-6, -16, 0); group.add(legL);
      const legR = new THREE.Mesh(legGeo, suitMat); legR.position.set(6, -16, 0); group.add(legR);
      rig.legL = legL; rig.legR = legR; rig.armL = armL; rig.armR = armR;

      const chestLight = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), trimMat);
      chestLight.position.set(0, 12, 12.5);
      group.add(chestLight);
      rig.chestLight = chestLight;

      if (glow) scene.remove(glow);
      glow = new THREE.PointLight(color, 1.2, 90);
      glow.position.set(0, 20, 30);
      scene.add(glow);
    }
    buildAstronaut('cyan');

    let t = 0, lastTint = 'cyan';
    function frame() {
      requestAnimationFrame(frame);
      if (canvas.offsetParent === null) return;
      const st = window.SV_ASTRONAUT_STATE;
      const { w, h } = fitRenderer(renderer, canvas, camera);
      camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      if (st) {
        if (st.suitTint !== lastTint) { lastTint = st.suitTint; buildAstronaut(lastTint); }
        t += st.moving ? 0.24 : 0.05;
        const walk = st.moving ? Math.sin(t * 6) * 0.55 : 0;
        const bob = st.moving ? Math.abs(Math.sin(t * 6)) * 1.4 : Math.sin(t * 2) * 0.6;
        outerGroup.position.set(st.x - w / 2, h / 2 - st.y + bob, 0);
        outerGroup.rotation.z = -(st.facing + Math.PI / 2);
        if (rig.legL) rig.legL.rotation.x = walk;
        if (rig.legR) rig.legR.rotation.x = -walk;
        if (rig.armL) rig.armL.rotation.x = -walk * 0.6;
        if (rig.armR) rig.armR.rotation.x = walk * 0.6;
        if (rig.chestLight) rig.chestLight.material.emissiveIntensity = 0.5 + Math.sin(performance.now() * 0.004) * 0.3;
        if (rig.antennaTip) rig.antennaTip.material.emissiveIntensity = Math.sin(performance.now() * 0.006) > 0 ? 1.2 : 0.3;
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

    window.SV_ASTRONAUT_3D_READY = true;
  }

  function boot() {
    initShipScene();
    initAstronautScene();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
