import * as THREE from 'three';
import { RingFinish, LightingAtmosphere } from '../../types/wedding';

/**
 * Creates a procedural high-resolution canvas texture for the ring plinth / marble altar floor.
 */
export function createMarbleTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm cream/ivory background
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle warm veins
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = `rgba(180, 168, 145, ${0.08 + Math.random() * 0.08})`;
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 120;
      y += Math.random() * 90;
      ctx.quadraticCurveTo(x + 20, y - 20, x, y);
    }
    ctx.stroke();
  }

  // Soft gold flecks
  for (let i = 0; i < 40; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    const rad = Math.random() * 2 + 0.5;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.beginPath();
    ctx.arc(gx, gy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a procedural monogram seal medallion texture ("JM • 28.07.2026")
 */
export function createMonogramSealTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Outer dark olive / gold gradient
  const grad = ctx.createRadialGradient(256, 256, 60, 256, 256, 256);
  grad.addColorStop(0, '#667C3E');
  grad.addColorStop(0.7, '#485C27');
  grad.addColorStop(1, '#2E3D18');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fill();

  // Double concentric gold rings
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 226, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 256, 218, 0, Math.PI * 2);
  ctx.stroke();

  // Monogram letters "BA"
  ctx.fillStyle = '#F5E6C8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 110px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('B ♡ A', 256, 220);

  // Date inscription
  ctx.font = '600 24px "Inter", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillStyle = '#E8D29F';
  ctx.fillText('10 · NOVEMBER · 2026', 256, 310);

  // Subtitle
  ctx.font = '300 18px "Inter", sans-serif';
  ctx.fillStyle = '#C2B085';
  ctx.fillText('WAVE BOLGODA, SRI LANKA', 256, 345);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Creates a soft radial contact shadow texture.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const radGrad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  radGrad.addColorStop(0, 'rgba(30, 25, 20, 0.65)');
  radGrad.addColorStop(0.4, 'rgba(40, 35, 30, 0.35)');
  radGrad.addColorStop(0.8, 'rgba(50, 45, 40, 0.08)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Gets PBR materials for the rings based on chosen finish and software GL status.
 */
export function getRingMaterials(finish: RingFinish, isSoftwareGl: boolean) {
  let mainColor: number;
  let accentColor: number;
  let metalness = 0.95;
  let roughness = 0.12;

  switch (finish) {
    case 'rose_gold':
      mainColor = 0xb76e79;
      accentColor = 0xc8828d;
      roughness = 0.14;
      break;
    case 'platinum':
      mainColor = 0xe5e4e2;
      accentColor = 0xf0f0f0;
      metalness = 0.98;
      roughness = 0.08;
      break;
    case 'sapphire':
      mainColor = 0x1d3d63; // Ceylon royal blue sapphire
      accentColor = 0x3a608d;
      metalness = 0.85;
      roughness = 0.15;
      break;
    case 'yellow_gold':
    default:
      mainColor = 0xd4af37; // 18k classic gold
      accentColor = 0xedd68a;
      roughness = 0.12;
      break;
  }

  // Primary band material
  const primaryBandMaterial = new THREE.MeshPhysicalMaterial({
    color: mainColor,
    metalness,
    roughness,
    clearcoat: isSoftwareGl ? 0 : 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  });

  // Secondary partner band (intertwining band)
  const secondaryBandMaterial = new THREE.MeshPhysicalMaterial({
    color: finish === 'rose_gold' ? 0xd4af37 : (finish === 'yellow_gold' ? 0xb76e79 : 0xedd68a),
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: isSoftwareGl ? 0 : 0.5,
  });

  // Diamond setting material: brilliant faceted refractive gemstone
  const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: finish === 'sapphire' ? 0x19457a : 0xffffff,
    transmission: isSoftwareGl ? 0 : 0.95,
    opacity: isSoftwareGl ? 0.45 : 1.0,
    transparent: true,
    ior: 2.417, // Real diamond index of refraction
    roughness: 0.0,
    metalness: 0.05,
    dispersion: 0.044,
    thickness: 1.2,
    attenuationColor: new THREE.Color(finish === 'sapphire' ? 0x2255aa : 0xf4f9ff),
    attenuationDistance: 0.6,
  });

  // Prong claws and bezel (polished platinum or white gold for brilliant diamond contrast)
  const prongMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.96,
    roughness: 0.18,
  });

  return { primaryBandMaterial, secondaryBandMaterial, diamondMaterial, prongMaterial };
}

/**
 * Lighting presets
 */
export function getLightingAtmosphereParams(atmo: LightingAtmosphere) {
  switch (atmo) {
    case 'candlelight':
      return {
        keyColor: 0xffa454,
        keyIntensity: 2.4,
        hemiSky: 0xffd2a0,
        hemiGround: 0x331a0a,
        hemiIntensity: 0.8,
        fogColor: 0x1f1610,
        bgColor: 0x17110d,
        exposure: 1.25,
      };
    case 'colombo_night':
      return {
        keyColor: 0x90b4e0,
        keyIntensity: 1.8,
        hemiSky: 0x304868,
        hemiGround: 0x0c141c,
        hemiIntensity: 0.6,
        fogColor: 0x0c141d,
        bgColor: 0x090f15,
        exposure: 1.15,
      };
    case 'golden_hour':
    default:
      return {
        keyColor: 0xfff3db,
        keyIntensity: 2.2,
        hemiSky: 0xffeedd,
        hemiGround: 0x556b2f,
        hemiIntensity: 0.75,
        fogColor: 0xfaf8f3,
        bgColor: 0xfaf8f3,
        exposure: 1.1,
      };
  }
}
