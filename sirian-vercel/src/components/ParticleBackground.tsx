import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const testCanvas = document.createElement("canvas");
    const testCtx = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
    if (!testCtx) return;

    const scene = new THREE.Scene();

    // Fog for cinematic depth
    scene.fog = new THREE.FogExp2(0x000000, 0.06);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // --- Very subtle particles ---
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x333333, size: 0.025, transparent: true, opacity: 0.55 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- Majestic Crow ---
    const crowGroup = new THREE.Group();
    scene.add(crowGroup);

    // Body
    const bodyGeo = new THREE.ConeGeometry(0.08, 0.55, 6);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    crowGroup.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.set(0.35, 0.08, 0);
    crowGroup.add(headMesh);

    // Beak
    const beakGeo = new THREE.ConeGeometry(0.025, 0.12, 4);
    const beakMesh = new THREE.Mesh(beakGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
    beakMesh.rotation.z = -Math.PI / 2;
    beakMesh.position.set(0.47, 0.08, 0);
    crowGroup.add(beakMesh);

    // Left wing
    const leftWingVerts = new Float32Array([
      0, 0, 0,
      -0.18, 0, 0.05,
      -0.6, 0.4, 0.15,
      -0.9, 0.1, 0.05,
      -0.55, -0.15, 0,
      -0.15, -0.05, 0,
    ]);
    const leftWingGeo = new THREE.BufferGeometry();
    leftWingGeo.setAttribute("position", new THREE.BufferAttribute(leftWingVerts, 3));
    leftWingGeo.setIndex([0,1,5, 1,2,5, 2,3,4, 2,4,5]);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x151515, side: THREE.DoubleSide });
    const leftWing = new THREE.Mesh(leftWingGeo, wingMat);
    leftWing.position.set(-0.1, 0, 0);
    crowGroup.add(leftWing);

    // Right wing (mirror)
    const rightWingVerts = new Float32Array([
      0, 0, 0,
      -0.18, 0, -0.05,
      -0.6, 0.4, -0.15,
      -0.9, 0.1, -0.05,
      -0.55, -0.15, 0,
      -0.15, -0.05, 0,
    ]);
    const rightWingGeo = new THREE.BufferGeometry();
    rightWingGeo.setAttribute("position", new THREE.BufferAttribute(rightWingVerts, 3));
    rightWingGeo.setIndex([0,1,5, 1,2,5, 2,3,4, 2,4,5]);
    const rightWing = new THREE.Mesh(rightWingGeo, wingMat);
    rightWing.position.set(-0.1, 0, 0);
    crowGroup.add(rightWing);

    // Tail
    const tailGeo = new THREE.ConeGeometry(0.06, 0.28, 5);
    const tailMesh = new THREE.Mesh(tailGeo, bodyMat);
    tailMesh.rotation.z = -Math.PI / 2;
    tailMesh.position.set(-0.35, -0.04, 0);
    crowGroup.add(tailMesh);

    // Crow flight path — large, majestic figure-8 / oval
    let t = 0;
    const crowScale = 1.3;
    crowGroup.scale.setScalar(crowScale);

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.003; // slow, majestic speed

      particles.rotation.y += 0.0003;

      // Figure-eight path across the whole scene
      const cx = Math.sin(t) * 7;
      const cy = Math.sin(t * 2) * 1.8;
      const cz = Math.cos(t * 0.7) * 2 - 1;
      crowGroup.position.set(cx, cy, cz);

      // Face direction of travel
      const nextT = t + 0.015;
      const nx = Math.sin(nextT) * 7;
      const ny = Math.sin(nextT * 2) * 1.8;
      const nz = Math.cos(nextT * 0.7) * 2 - 1;
      crowGroup.lookAt(nx, ny, nz);
      crowGroup.rotateY(-Math.PI / 2);
      crowGroup.rotateZ(Math.PI / 2);

      // Wing flap — slow and powerful
      const flapAngle = Math.sin(t * 5) * 0.45;
      leftWing.rotation.x = flapAngle;
      rightWing.rotation.x = -flapAngle;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#000000" }}
    />
  );
}
