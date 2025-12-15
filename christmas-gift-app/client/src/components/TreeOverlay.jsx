import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TreeOverlay() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 58);

    // ✅ sáng rực hơn
    scene.add(new THREE.AmbientLight(0xffffff, 1.05));

    const keyLight = new THREE.PointLight(0xffffff, 2.8, 320);
    keyLight.position.set(0, 55, 70);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(0xfff0cc, 1.9, 280);
    warmLight.position.set(-26, 26, 36);
    scene.add(warmLight);

    // star shape
    const starShape = new THREE.Shape();
    const outerRadius = 1;
    const innerRadius = 0.5;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
    });

    // ✅ ngôi sao top sáng + emissive mạnh
    const topStarMat = new THREE.MeshPhongMaterial({
      color: 0xfff7a8,
      shininess: 220,
      emissive: 0xffd36a,
      emissiveIntensity: 2.6,
    });

    const greenMatBase = new THREE.MeshPhongMaterial({
      color: 0x00aa55,
      shininess: 140,
      emissive: 0x001a0e,
      emissiveIntensity: 0.2,
    });

    // top star
    const layers = 16;
    const topStar = new THREE.Mesh(starGeo, topStarMat);
    topStar.scale.set(3.2, 3.2, 3.2);
    topStar.position.set(0.2, layers * 2 + 3.4, 0.2);
    scene.add(topStar);

    // outer ring stars (tree silhouette)
    const starsGroup = new THREE.Group();
    const starsPerLayer = 44;

    for (let layer = 0; layer < layers; layer++) {
      const radius = 12 - layer * 0.65;
      const y = layer * 2;
      for (let i = 0; i < starsPerLayer; i++) {
        const angle = (i / starsPerLayer) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        const star = new THREE.Mesh(starGeo, greenMatBase.clone());
        star.scale.set(0.56, 0.56, 0.56);
        star.position.set(x, y, z);
        star.rotation.set(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * Math.PI * 2,
          (Math.random() - 0.5) * 0.4
        );
        starsGroup.add(star);
      }
    }
    scene.add(starsGroup);

    // inner sparkle stars (random colors, some emissive)
    const innerGroup = new THREE.Group();
    const innerCount = 1250;

    for (let i = 0; i < innerCount; i++) {
      const progress = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const radius = (1 - progress) * 9.5;
      const y = progress * layers * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const color = new THREE.Color().setHSL(Math.random(), 0.9, 0.6);
      const mat = new THREE.MeshPhongMaterial({
        color,
        shininess: 220,
        emissive: color,
        emissiveIntensity: Math.random() < 0.28 ? 1.1 : 0.35,
      });

      const star = new THREE.Mesh(starGeo, mat);
      star.scale.set(0.52, 0.52, 0.52);
      star.position.set(x, y, z);
      star.userData.tw = Math.random() * 2 + 2; // twinkle speed
      innerGroup.add(star);
    }
    scene.add(innerGroup);

    // ornaments
    const ornamentsGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const redMat = new THREE.MeshPhongMaterial({
      color: 0xff3355,
      shininess: 180,
      emissive: 0x33000a,
      emissiveIntensity: 0.45,
    });
    const silverMat = new THREE.MeshPhongMaterial({
      color: 0xd9d9d9,
      shininess: 220,
      emissive: 0x1a1a1a,
      emissiveIntensity: 0.25,
    });

    for (let i = 0; i < 180; i++) {
      const randomLayer = Math.random() * layers;
      const randomRadius = 12 - randomLayer * 0.65 + Math.random() * 0.8;
      const randomAngle = Math.random() * Math.PI * 2;

      const x = randomRadius * Math.cos(randomAngle);
      const y = randomLayer * 2;
      const z = randomRadius * Math.sin(randomAngle);

      const mat = Math.random() > 0.5 ? redMat : silverMat;
      const ball = new THREE.Mesh(sphereGeo, mat);
      ball.position.set(x, y, z);
      ornamentsGroup.add(ball);
    }
    scene.add(ornamentsGroup);

    // fairy dust (gold additive)
    const dustGroup = new THREE.Group();
    const dustCount = 1100;
    const dustGeo = new THREE.SphereGeometry(0.11, 8, 8);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustParticles = [];
    for (let i = 0; i < dustCount; i++) {
      const p = new THREE.Mesh(dustGeo, dustMat);
      p.userData.angle = Math.random() * Math.PI * 2;
      p.userData.radius = Math.random() * 6 + 7;
      p.userData.height = Math.random() * 34 + 2;
      p.userData.speed = Math.random() * 0.03 + 0.012;
      p.position.y = p.userData.height;
      dustParticles.push(p);
      dustGroup.add(p);
    }
    scene.add(dustGroup);

    // snow
    const snowGroup = new THREE.Group();
    const snowCount = 900;
    const snowGeo = new THREE.SphereGeometry(0.12, 9, 9);
    const snowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    for (let i = 0; i < snowCount; i++) {
      const s = new THREE.Mesh(snowGeo, snowMat);
      s.position.set(
        (Math.random() - 0.5) * 120,
        Math.random() * 70,
        (Math.random() - 0.5) * 120
      );
      s.userData.vy = Math.random() * 0.14 + 0.05;
      snowGroup.add(s);
    }
    scene.add(snowGroup);

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x = Math.sin(t * 0.25) * 1.2;
      camera.position.y = 18 + Math.sin(t * 0.18) * 0.8;
      camera.lookAt(0, 18, 0);

      innerGroup.rotation.y += 0.02;
      starsGroup.rotation.y += 0.01;
      ornamentsGroup.rotation.y += 0.012;
      topStar.rotation.y += 0.025;

      // ✅ twinkle
      topStarMat.emissiveIntensity = 2.2 + Math.sin(t * 6) * 0.65;
      const s = 3.2 + Math.sin(t * 4) * 0.06;
      topStar.scale.set(s, s, s);

      innerGroup.children.forEach((m) => {
        const sp = m.userData.tw || 3;
        if (m.material?.emissiveIntensity !== undefined) {
          m.material.emissiveIntensity =
            0.35 + (Math.sin(t * sp + m.position.x) + 1) * 0.45;
        }
      });

      snowGroup.children.forEach((x) => {
        x.position.y -= x.userData.vy;
        if (x.position.y < 0) x.position.y = 70;
      });

      dustParticles.forEach((p) => {
        p.userData.angle += p.userData.speed;
        p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
        p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
        p.position.y -= 0.085;
        if (p.position.y < 0) p.position.y = p.userData.height;
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      sphereGeo.dispose();
      dustGeo.dispose();
      snowGeo.dispose();
    };
  }, []);

  return (
    <div className="treeOverlay">
      {/* ✅ nền tối đen để cây nổi bật */}
      <div className="treeBackdrop" />
      <div className="treeMount" ref={mountRef} />

      <style>{`
        .treeOverlay{
          position: fixed; inset:0; z-index: 200;
          overflow:hidden;
          animation: overlayIn .45s ease forwards;
          pointer-events: none;
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }

        .treeBackdrop{
          position:absolute; inset:0;
          /* đen rõ + vignette */
          background:
            radial-gradient(circle at 50% 55%, rgba(0,0,0,.40), rgba(0,0,0,.88));
        }
        .treeMount{ position:absolute; inset:0; }
      `}</style>
    </div>
  );
}
