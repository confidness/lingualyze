import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { LogoMark } from './Logo';

// The logo mark in 3D: subject, object and verb blocks stepping down, verb last and gold (SOV).
const BLOCKS = [
  { w: 2.0, x: -1.0, y: 1.35, color: 0x0c7a9c }, // subject
  { w: 2.8, x: 0.0, y: 0.0, color: 0x0c7a9c },   // object
  { w: 2.0, x: 1.0, y: -1.35, color: 0xf2b705 }, // verb
];

// Entrance pop with a little overshoot
const easeOutBack = (x: number) => 1 + 2.5 * (x - 1) ** 3 + 1.5 * (x - 1) ** 2;

export default function LogoBlocks3D({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true); // no WebGL: show the flat logo instead
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.NeutralToneMapping; // keeps the brand blue and gold true
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbfdbe6, 1.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x74c5dc, 1.2);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);
    const meshes = BLOCKS.map(b => {
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(b.w, 1.1, 0.9, 4, 0.22),
        new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.35, metalness: 0.05 })
      );
      mesh.position.set(b.x, b.y, 0);
      group.add(mesh);
      return mesh;
    });

    const pose = (t: number, tiltX: number, tiltY: number) => {
      meshes.forEach((m, i) => {
        const p = Math.min(1, Math.max(0, (t - i * 0.12) / 0.7));
        m.scale.setScalar(Math.max(0.001, easeOutBack(p)));
        m.position.z = Math.sin(t * 1.1 + i * 0.9) * 0.12;
      });
      group.rotation.y = -0.35 + Math.sin(t * 0.4) * 0.3 + tiltX * 0.6;
      group.rotation.x = 0.2 + tiltY * 0.4;
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduce) renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // Pointer tilt, smoothed toward the target every frame
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / innerWidth - 0.5;
      target.y = e.clientY / innerHeight - 0.5;
    };

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(mount);

    if (reduce) {
      pose(10, 0, 0); // settled end state, no motion
      resize();
    } else {
      addEventListener('pointermove', onPointer);
      const clock = new THREE.Clock();
      renderer.setAnimationLoop(() => {
        if (!visible) return;
        smooth.x += (target.x - smooth.x) * 0.06;
        smooth.y += (target.y - smooth.y) * 0.06;
        pose(clock.getElapsedTime(), smooth.x, smooth.y);
        renderer.render(scene, camera);
      });
    }

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      visibility.disconnect();
      removeEventListener('pointermove', onPointer);
      meshes.forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className={`flex items-center justify-center ${className}`} role="img" aria-label="Lingualyze">
      {failed && <LogoMark className="w-24 h-24" />}
    </div>
  );
}
