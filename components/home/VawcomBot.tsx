'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Brand green from the site outline PDF */
const BRAND = 0x0cb78b;

export default function VawcomBot() {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let renderer: import('three').WebGLRenderer | undefined;
    let raf = 0;
    let pmrem: import('three').PMREMGenerator | undefined;

    const run = async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (dead || !host) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
      // Sharper on retina — was capped at 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      host.appendChild(renderer.domElement);

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      pmrem = new THREE.PMREMGenerator(renderer);
      // Crisper env reflections (lower blur)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
      scene.environmentIntensity = 1.15;

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const key = new THREE.DirectionalLight(0xffffff, 1.65);
      key.position.set(2.4, 3.8, 3.4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 0.55);
      fill.position.set(-2.4, 1.6, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.55);
      rim.position.set(-1, 2.2, -2.8);
      scene.add(rim);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      // Painted Body/Visor/Eyes + baked normal/MR from the original
      const gltf = await loader.loadAsync('/models/bot.glb?v=hd1');
      if (dead) return;

      const bot = gltf.scene;
      const remove: import('three').Object3D[] = [];
      bot.traverse((obj) => {
        const name = obj.name;
        if (/^Cube/i.test(name) || /\.001$/.test(name)) {
          remove.push(obj);
          return;
        }
        const mesh = obj as import('three').Mesh;
        if (!mesh.isMesh) return;
        mesh.frustumCulled = false;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const onlyOld = mats.every((mat) => {
          const n = (mat as import('three').Material).name || '';
          return !n || /^Material$/i.test(n) || /Material_0/i.test(n);
        });
        if (onlyOld) {
          remove.push(obj);
          return;
        }

        const nextMats = mats.map((mat) => {
          const old = mat as import('three').MeshStandardMaterial;
          const matName = old.name || '';
          const isVisor = /visor/i.test(matName);
          const isEye = /eye/i.test(matName);

          const color = old.color?.clone?.() ?? new THREE.Color(BRAND);
          if (isEye) color.setHex(0xffffff);
          else if (isVisor) color.setHex(0x0a0a0c);

          // Keep normal + MR from the GLB; never use albedo (splotches)
          if (old.normalMap) {
            old.normalMap.anisotropy = maxAniso;
            old.normalMap.colorSpace = THREE.NoColorSpace;
          }
          if (old.metalnessMap) {
            old.metalnessMap.anisotropy = maxAniso;
            old.metalnessMap.colorSpace = THREE.NoColorSpace;
          }
          if (old.roughnessMap) {
            old.roughnessMap.anisotropy = maxAniso;
            old.roughnessMap.colorSpace = THREE.NoColorSpace;
          }

          const m = new THREE.MeshPhysicalMaterial({
            color,
            name: matName,
            map: null,
            normalMap: isEye ? null : old.normalMap,
            normalScale: new THREE.Vector2(1, 1),
            metalnessMap: isEye ? null : old.metalnessMap,
            roughnessMap: isEye ? null : old.roughnessMap,
            metalness: isEye ? 0.05 : 1,
            roughness: isEye ? 0.35 : 1,
            clearcoat: isEye ? 0.2 : 0.65,
            clearcoatRoughness: 0.18,
            envMapIntensity: 1.2,
            emissive: isEye ? new THREE.Color(0xffffff) : new THREE.Color(0x000000),
            emissiveIntensity: isEye ? 0.25 : 0,
          });
          old.map = null;
          old.dispose();
          return m;
        });
        mesh.material = nextMats.length === 1 ? nextMats[0] : nextMats;
      });
      for (const obj of remove) obj.parent?.remove(obj);

      // Face toward the copy (page center), not the right edge
      bot.rotation.y = -0.35;
      const box = new THREE.Box3().setFromObject(bot);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      bot.position.sub(center);
      scene.add(bot);

      const span = Math.max(size.x, size.y, size.z) || 1;
      const fov = camera.fov * (Math.PI / 180);
      const fitH = size.y / (2 * Math.tan(fov / 2));
      const fitW = size.x / (2 * Math.tan(fov / 2) * camera.aspect);
      const dist = Math.max(fitH, fitW) * 1.28;
      camera.position.set(0, size.y * 0.08, Math.max(dist, span * 2.3));
      camera.near = dist / 100;
      camera.far = dist * 100;
      camera.lookAt(0, -size.y * 0.06, 0);
      camera.updateProjectionMatrix();

      const fit = () => {
        if (!host || !renderer) return;
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (w < 8 || h < 8) return;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        camera.aspect = w / h;
        const fitH2 = size.y / (2 * Math.tan((camera.fov * Math.PI) / 180 / 2));
        const fitW2 = size.x / (2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.aspect);
        const dist2 = Math.max(fitH2, fitW2) * 1.28;
        camera.position.set(0, size.y * 0.08, Math.max(dist2, span * 2.3));
        camera.lookAt(0, -size.y * 0.06, 0);
        camera.updateProjectionMatrix();
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(host);

      const loop = () => {
        if (dead || !renderer) return;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      return () => ro.disconnect();
    };

    const extra = run();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      void extra.then((cleanup) => cleanup?.());
      pmrem?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none relative z-[3] flex h-[20rem] w-full max-w-[24rem] flex-col items-center justify-center overflow-visible sm:h-[24rem] sm:max-w-[28rem] lg:h-[min(64vh,36rem)] lg:max-w-[36rem] lg:translate-x-[-1.5rem]"
    >
      <motion.div
        className="relative flex h-full w-full flex-col items-center"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={
          reduce
            ? { opacity: 1, y: 0, rotate: 0 }
            : {
                opacity: 1,
                y: [0, -14, 0],
                rotate: [0, -2.5, 2.5, 0],
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                y: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                },
                rotate: {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                },
              }
        }
      >
        <div ref={hostRef} className="relative z-[1] h-[86%] w-full shrink-0" />

        <motion.div
          className="relative z-[2] -mt-[9%] h-[12%] w-[54%] shrink-0 rounded-[100%] bg-[#0cb78b]/35"
          animate={
            reduce
              ? { scale: 1, opacity: 0.35 }
              : {
                  scale: [1, 0.88, 1],
                  opacity: [0.38, 0.22, 0.38],
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
          }
          style={{
            boxShadow: '0 0 28px 8px rgba(12, 183, 139, 0.28)',
          }}
        />
      </motion.div>
    </div>
  );
}
