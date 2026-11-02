import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildRingsScene,
  buildCeremonyArchScene,
  buildCelebrationToastScene,
} from './geometries';
import { getLightingAtmosphereParams, getRingMaterials } from './materials';
import { SceneMode, RingFinish, LightingAtmosphere, CameraPreset } from '../../types/wedding';

// Module-level pre-allocated scratch objects (zero GC in render loop)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPosition = new THREE.Vector3();
const _dummyQuaternion = new THREE.Quaternion();
const _dummyEuler = new THREE.Euler();
const _dummyScale = new THREE.Vector3();

interface WeddingSceneProps {
  sceneMode: SceneMode;
  ringFinish: RingFinish;
  lighting: LightingAtmosphere;
  cameraPreset: CameraPreset;
  ringSeparation: number; // 0 (united) to 1 (separated)
  triggerPetalsCount: number;
}

export const WeddingScene: React.FC<WeddingSceneProps> = ({
  sceneMode,
  ringFinish,
  lighting,
  cameraPreset,
  ringSeparation,
  triggerPetalsCount,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Store mutable state in refs so React re-renders never tear down canvas or recreate scene
  const sceneModeRef = useRef(sceneMode);
  sceneModeRef.current = sceneMode;

  const ringFinishRef = useRef(ringFinish);
  ringFinishRef.current = ringFinish;

  const lightingRef = useRef(lighting);
  lightingRef.current = lighting;

  const cameraPresetRef = useRef(cameraPreset);
  cameraPresetRef.current = cameraPreset;

  const ringSeparationRef = useRef(ringSeparation);
  ringSeparationRef.current = ringSeparation;

  const isTransitioningCameraRef = useRef(false);

  // Scene sub-references for dynamic updates
  const ringsSceneRef = useRef<ReturnType<typeof buildRingsScene> | null>(null);
  const archSceneRef = useRef<ReturnType<typeof buildCeremonyArchScene> | null>(null);
  const toastSceneRef = useRef<ReturnType<typeof buildCelebrationToastScene> | null>(null);

  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sceneInstanceRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL per Three.js skill standards
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneInstanceRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.6, 5.8);
    cameraRef.current = camera;

    // 4. OrbitControls with damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 16.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't clip below ground
    controls.target.set(0, 1.1, 0);
    controlsRef.current = controls;

    // Cancel automated camera transition when user manually interacts
    controls.addEventListener('start', () => {
      isTransitioningCameraRef.current = false;
    });

    // 5. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Studio Lighting Rig
    const initialLighting = getLightingAtmosphereParams(lightingRef.current);

    const hemiLight = new THREE.HemisphereLight(
      initialLighting.hemiSky,
      initialLighting.hemiGround,
      initialLighting.hemiIntensity
    );
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const keyLight = new THREE.DirectionalLight(
      initialLighting.keyColor,
      initialLighting.keyIntensity
    );
    keyLight.position.set(4.5, 7.5, 5.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.6);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Fog matched to horizon background
    scene.fog = new THREE.FogExp2(initialLighting.fogColor, 0.04);

    // 7. Assemble 3D scenes
    const ringsScene = buildRingsScene(renderer, ringFinishRef.current, isSoftwareGl);
    ringsSceneRef.current = ringsScene;
    scene.add(ringsScene.root);

    const archScene = buildCeremonyArchScene(renderer, isSoftwareGl);
    archSceneRef.current = archScene;
    archScene.root.visible = false;
    scene.add(archScene.root);

    const toastScene = buildCelebrationToastScene(renderer, isSoftwareGl);
    toastSceneRef.current = toastScene;
    toastScene.root.visible = false;
    scene.add(toastScene.root);

    // 8. Animation & Render loop with software-WebGL pacing
    let frameId = 0;
    let lastTime = performance.now();
    let currentSeparation = ringSeparationRef.current;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update visible scene depending on mode
      const currentMode = sceneModeRef.current;
      if (ringsSceneRef.current) ringsSceneRef.current.root.visible = currentMode === 'rings';
      if (archSceneRef.current) archSceneRef.current.root.visible = currentMode === 'arch';
      if (toastSceneRef.current) toastSceneRef.current.root.visible = currentMode === 'toast';

      // Ring smooth exponential separation damping
      if (currentMode === 'rings' && ringsSceneRef.current) {
        const targetSep = ringSeparationRef.current;
        currentSeparation += (targetSep - currentSeparation) * (1 - Math.exp(-8 * dt));

        const r1 = ringsSceneRef.current.ring1Group;
        const r2 = ringsSceneRef.current.ring2Group;

        // Base united position: (-0.35, 1.35, 0) and (0.35, 1.35, 0)
        // Separated position: (-1.4, 1.5, 0) and (1.4, 1.5, 0)
        const offset = 0.35 + currentSeparation * 1.05;
        r1.position.x = -offset;
        r2.position.x = offset;

        // Subtle gentle breathing rotation
        r1.rotation.y = 0.35 + Math.sin(now * 0.0012) * 0.08;
        r2.rotation.y = -0.35 - Math.sin(now * 0.0012) * 0.08;

        // Animate floating petals
        const petals = ringsSceneRef.current.petalsMesh;
        const vels = ringsSceneRef.current.petalVelocities;
        for (let i = 0; i < vels.length; i++) {
          petals.getMatrixAt(i, _dummyMatrix);
          _dummyMatrix.decompose(_dummyPosition, _dummyQuaternion, _dummyScale);

          _dummyPosition.y += vels[i].y;
          _dummyPosition.x += vels[i].x;
          _dummyPosition.z += vels[i].z;

          _dummyEuler.setFromQuaternion(_dummyQuaternion);
          _dummyEuler.x += vels[i].rotSpeed;
          _dummyEuler.y += vels[i].rotSpeed * 0.8;
          _dummyQuaternion.setFromEuler(_dummyEuler);

          // Recycle petals to top
          if (_dummyPosition.y < 0.1) {
            _dummyPosition.y = 4.8;
            _dummyPosition.x = (Math.random() - 0.5) * 5.5;
            _dummyPosition.z = (Math.random() - 0.5) * 5.5;
          }

          _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
          petals.setMatrixAt(i, _dummyMatrix);
        }
        petals.instanceMatrix.needsUpdate = true;
      }

      // Smooth camera transition if preset requested
      if (isTransitioningCameraRef.current) {
        camera.position.lerp(_targetCamPos, 1 - Math.exp(-4 * dt));
        controls.target.lerp(_targetLookAt, 1 - Math.exp(-4 * dt));

        if (camera.position.distanceTo(_targetCamPos) < 0.04) {
          isTransitioningCameraRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Effect to update materials when ring finish changes
  useEffect(() => {
    if (!ringsSceneRef.current) return;
    const { primaryBandMaterial, secondaryBandMaterial, diamondMaterial, prongMaterial } =
      getRingMaterials(ringFinish, false);

    // Apply updated materials to ring meshes
    const r1 = ringsSceneRef.current.ring1Group;
    const r2 = ringsSceneRef.current.ring2Group;

    r1.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === 'Diamond' || child.geometry.type === 'BufferGeometry') {
          // Keep diamond material
        } else {
          child.material = primaryBandMaterial;
        }
      }
    });

    r2.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = secondaryBandMaterial;
      }
    });
  }, [ringFinish]);

  // Effect to update lighting atmosphere
  useEffect(() => {
    if (!sceneInstanceRef.current || !keyLightRef.current || !hemiLightRef.current) return;
    const params = getLightingAtmosphereParams(lighting);

    keyLightRef.current.color.setHex(params.keyColor);
    keyLightRef.current.intensity = params.keyIntensity;

    hemiLightRef.current.color.setHex(params.hemiSky);
    hemiLightRef.current.groundColor.setHex(params.hemiGround);
    hemiLightRef.current.intensity = params.hemiIntensity;

    if (sceneInstanceRef.current.fog instanceof THREE.FogExp2) {
      sceneInstanceRef.current.fog.color.setHex(params.fogColor);
    }
  }, [lighting]);

  // Effect to reframe camera when switching scene mode
  useEffect(() => {
    if (sceneMode === 'arch') {
      _targetCamPos.set(0, 2.0, 5.4);
      _targetLookAt.set(0, 1.6, 0);
    } else if (sceneMode === 'toast') {
      _targetCamPos.set(0, 2.0, 4.4);
      _targetLookAt.set(0, 1.4, 0);
    } else {
      _targetCamPos.set(0, 2.5, 5.6);
      _targetLookAt.set(0, 1.1, 0);
    }
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.copy(_targetLookAt);
      cameraRef.current.position.copy(_targetCamPos);
      controlsRef.current.update();
    }
  }, [sceneMode]);

  // Effect to update camera preset
  useEffect(() => {
    switch (cameraPreset) {
      case 'closeup':
        _targetCamPos.set(0, 1.6, 2.6);
        _targetLookAt.set(0, 1.35, 0);
        break;
      case 'topdown':
        _targetCamPos.set(0, 4.8, 1.2);
        _targetLookAt.set(0, 0.6, 0);
        break;
      case 'arch':
        _targetCamPos.set(0, 2.0, 5.4);
        _targetLookAt.set(0, 1.6, 0);
        break;
      case 'default':
      default:
        if (sceneModeRef.current === 'arch') {
          _targetCamPos.set(0, 2.0, 5.4);
          _targetLookAt.set(0, 1.6, 0);
        } else if (sceneModeRef.current === 'toast') {
          _targetCamPos.set(0, 2.0, 4.4);
          _targetLookAt.set(0, 1.4, 0);
        } else {
          _targetCamPos.set(0, 2.5, 5.6);
          _targetLookAt.set(0, 1.1, 0);
        }
        break;
    }
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.copy(_targetLookAt);
      cameraRef.current.position.copy(_targetCamPos);
      controlsRef.current.update();
    }
  }, [cameraPreset]);

  // Effect when user triggers petal shower
  useEffect(() => {
    if (triggerPetalsCount === 0 || !ringsSceneRef.current) return;
    const petals = ringsSceneRef.current.petalsMesh;
    const vels = ringsSceneRef.current.petalVelocities;
    for (let i = 0; i < vels.length; i++) {
      _dummyPosition.set(
        (Math.random() - 0.5) * 4.5,
        2.5 + Math.random() * 3.5,
        (Math.random() - 0.5) * 4.5
      );
      _dummyEuler.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      _dummyQuaternion.setFromEuler(_dummyEuler);
      _dummyScale.set(0.8, 0.8, 0.8);
      _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
      petals.setMatrixAt(i, _dummyMatrix);
    }
    petals.instanceMatrix.needsUpdate = true;
  }, [triggerPetalsCount]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
