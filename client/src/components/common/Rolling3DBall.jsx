import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates the exact texture from the reference image:
 * Bright neon lime-green sphere with distinct glossy black curved aerodynamic patches.
 */
function createBallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d', { alpha: false });

  // 1. Base vibrant neon lime-green gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGrad.addColorStop(0, '#B8FF14');
  baseGrad.addColorStop(0.5, '#A3E610');
  baseGrad.addColorStop(1, '#82C405');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw glossy deep obsidian/black distinctive curved patches (Reference matching)
  ctx.fillStyle = '#050706';

  const drawCurvedPatch = (centerX, centerY, scaleX, scaleY, angle) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.scale(scaleX * 0.5, scaleY * 0.5);

    ctx.beginPath();
    ctx.moveTo(-250, -80);
    ctx.bezierCurveTo(-150, -220, 150, -220, 250, -80);
    ctx.bezierCurveTo(280, 40, 180, 160, 50, 140);
    ctx.bezierCurveTo(-80, 120, -180, 40, -250, -80);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 160, 160, 85, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Curved black patches distributed across the sphere
  drawCurvedPatch(256, 190, 1.4, 1.3, -0.25);
  drawCurvedPatch(256, 350, 1.5, 1.1, 0.15);

  drawCurvedPatch(768, 190, 1.4, 1.3, 0.25);
  drawCurvedPatch(768, 350, 1.5, 1.1, -0.15);

  ctx.lineWidth = 8;
  ctx.strokeStyle = '#020302';
  ctx.beginPath();
  ctx.arc(512, 256, 90, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export const Rolling3DBall = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect user's reduced motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. Scene, Camera & WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = null; // Transparent so it seamlessly blends with Obsidian background

    let width = container.clientWidth;
    let height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Turned off for instant 60/120 FPS high performance
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lightweight DPI cap
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap; // Ultra fast shadow mapping

    container.appendChild(renderer.domElement);

    // --- 2. Environment & Studio Lights (Matches High-Reflective Reference Image) ---
    // Ambient soft studio light
    const ambientLight = new THREE.AmbientLight(0x0a150a, 1.2);
    scene.add(ambientLight);

    // Primary bright studio key light from top-front
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(2, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Neon lime green rim/fill light from right-top
    const rimLightGreen = new THREE.DirectionalLight(0xb8ff14, 2.5);
    rimLightGreen.position.set(4, 3, 2);
    scene.add(rimLightGreen);

    // Back kicker light for glossy edge highlights
    const kickerLight = new THREE.DirectionalLight(0xd4ff66, 1.8);
    kickerLight.position.set(-3, 2, -2);
    scene.add(kickerLight);

    // Bottom floor fill light
    const floorBounceLight = new THREE.DirectionalLight(0x1a3300, 1.0);
    floorBounceLight.position.set(0, -3, 2);
    scene.add(floorBounceLight);

    // --- 3. The 3D Sphere (Exact Reference Design) ---
    const ballRadius = 1.25;
    const sphereGeometry = new THREE.SphereGeometry(ballRadius, 36, 36);
    const ballTexture = createBallTexture();

    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      map: ballTexture,
      roughness: 0.12,          // Ultra polished glossy finish
      metalness: 0.08,
      clearcoat: 1.0,           // High reflective studio clearcoat
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      emissive: new THREE.Color(0x1a3300),
      emissiveIntensity: 0.18,  // Soft self-glow
    });

    const ballMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    ballMesh.position.y = 0;
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = false;
    scene.add(ballMesh);

    // --- 4. Shadow Receiver & Studio Floor Mirror Reflection ---
    const floorGeometry = new THREE.PlaneGeometry(30, 12);
    const floorMaterial = new THREE.ShadowMaterial({
      opacity: 0.55,
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -ballRadius;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor contact soft gradient disk that travels with the ball
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const shadowGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    shadowGrad.addColorStop(0.3, 'rgba(5, 15, 5, 0.6)');
    shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = shadowGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const contactShadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(ballRadius * 2.6, ballRadius * 2.6),
      new THREE.MeshBasicMaterial({
        map: contactShadowTexture,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadowPlane.rotation.x = -Math.PI / 2;
    contactShadowPlane.position.y = -ballRadius + 0.01;
    scene.add(contactShadowPlane);

    // --- 5. Natural Rolling Physics & Boundaries ---
    let posX = -3.2;
    let direction = 1; // 1 = moving right, -1 = moving left
    const speed = 0.024; // Smooth natural rolling pace
    const boundaryX = 3.6; // Calculated for camera frustum

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        // Linear movement from left to right and back
        posX += speed * direction;

        // Smooth turnaround at boundaries
        if (posX >= boundaryX) {
          direction = -1;
        } else if (posX <= -boundaryX) {
          direction = 1;
        }

        ballMesh.position.x = posX;
        contactShadowPlane.position.x = posX;

        // Realistic Rolling: angular displacement theta = distance / radius
        // When moving right (direction > 0), ball rolls clockwise around Z-axis (negative z-rotation)
        // Also add dynamic roll around X/Y to expose the 3D black curved pattern
        ballMesh.rotation.z -= (speed * direction) / ballRadius;
        ballMesh.rotation.y += 0.012 * direction;
        ballMesh.rotation.x += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. Responsive Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;

      camera.aspect = newWidth / newHeight;
      // Adjust camera distance for mobile vs desktop so ball fits perfectly
      if (newWidth < 640) {
        camera.position.z = 9.5;
      } else {
        camera.position.z = 7.5;
      }
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // --- 7. Cleanup on Unmount ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      ballTexture.dispose();
      contactShadowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-85"
      aria-hidden="true"
    />
  );
};

