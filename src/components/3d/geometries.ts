import * as THREE from 'three';
import {
  createMarbleTexture,
  createMonogramSealTexture,
  createContactShadowTexture,
  getRingMaterials,
} from './materials';
import { RingFinish } from '../../types/wedding';

/**
 * Creates a brilliant cut diamond geometry with faceted crown and pavilion.
 */
export function createDiamondGeometry(): THREE.BufferGeometry {
  // 16-sided faceted diamond shape
  const segments = 16;
  const vertices: number[] = [];
  const indices: number[] = [];

  // Table (flat top center)
  const tableY = 0.42;
  const tableRadius = 0.45;
  const girdleY = 0.15;
  const girdleRadius = 0.75;
  const culetY = -0.65; // bottom point

  // Center top vertex
  vertices.push(0, tableY, 0); // index 0

  // Table rim vertices
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * tableRadius, tableY, Math.sin(theta) * tableRadius);
  }

  // Girdle vertices
  const girdleStartIndex = vertices.length / 3;
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * girdleRadius, girdleY, Math.sin(theta) * girdleRadius);
  }

  // Culet (bottom point)
  const culetIndex = vertices.length / 3;
  vertices.push(0, culetY, 0);

  // Table faces (fan from center)
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(0, i + 1, next + 1);
  }

  // Crown facets (between table and girdle)
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const tCurrent = i + 1;
    const tNext = next + 1;
    const gCurrent = girdleStartIndex + i;
    const gNext = girdleStartIndex + next;

    indices.push(tCurrent, gCurrent, tNext);
    indices.push(tNext, gCurrent, gNext);
  }

  // Pavilion facets (from girdle down to culet)
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const gCurrent = girdleStartIndex + i;
    const gNext = girdleStartIndex + next;
    indices.push(gCurrent, culetIndex, gNext);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Builds the composite 10-part Wedding Rings 3D Group.
 */
export function buildRingsScene(
  renderer: THREE.WebGLRenderer,
  finish: RingFinish,
  isSoftwareGl: boolean
) {
  const root = new THREE.Group();
  root.name = 'RingsScene';

  const { primaryBandMaterial, secondaryBandMaterial, diamondMaterial, prongMaterial } =
    getRingMaterials(finish, isSoftwareGl);

  // Pedestal Plinth Base (Part 1 & 2: Beveled velvet cushion & brass collar)
  const plinthGroup = new THREE.Group();
  plinthGroup.position.y = 0;

  // Marble/Ivory cylindrical base
  const plinthBaseGeo = new THREE.CylinderGeometry(2.3, 2.5, 0.45, 48);
  const marbleTex = createMarbleTexture(renderer);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0xf5f2eb,
    map: marbleTex,
    roughness: 0.35,
    metalness: 0.1,
  });
  const plinthBase = new THREE.Mesh(plinthBaseGeo, plinthMat);
  plinthBase.position.y = 0.225;
  plinthBase.receiveShadow = true;
  plinthGroup.add(plinthBase);

  // Polished brass accent ring on plinth
  const plinthTrimGeo = new THREE.TorusGeometry(2.32, 0.045, 16, 64);
  const brassTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15,
  });
  const plinthTrim = new THREE.Mesh(plinthTrimGeo, brassTrimMat);
  plinthTrim.rotation.x = Math.PI / 2;
  plinthTrim.position.y = 0.44;
  plinthGroup.add(plinthTrim);

  // Velvet top cushion
  const cushionGeo = new THREE.CylinderGeometry(2.1, 2.2, 0.2, 48);
  const velvetMat = new THREE.MeshStandardMaterial({
    color: 0x3d4d23, // Deep olive green velvet cushion matching wedding palette
    roughness: 0.85,
    metalness: 0.05,
  });
  const cushion = new THREE.Mesh(cushionGeo, velvetMat);
  cushion.position.y = 0.52;
  cushion.receiveShadow = true;
  plinthGroup.add(cushion);

  // Soft Radial Contact Shadow plane (Part 3)
  const shadowGeo = new THREE.PlaneGeometry(5.8, 5.8);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.01;
  root.add(contactShadow);
  root.add(plinthGroup);

  // Floating Monogram Medallion seal (Part 4)
  const sealGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.06, 48);
  const sealTex = createMonogramSealTexture(renderer);
  const sealMat = new THREE.MeshStandardMaterial({
    map: sealTex,
    roughness: 0.35,
    metalness: 0.45,
  });
  const seal = new THREE.Mesh(sealGeo, sealMat);
  seal.position.set(0, 0.63, 0);
  seal.receiveShadow = true;
  root.add(seal);

  // Ring 1: Achini's Solitaire Diamond Ring (Parts 5, 6, 7)
  const ring1Group = new THREE.Group();
  ring1Group.name = 'RingAchini';
  ring1Group.position.set(-0.55, 1.35, 0);
  ring1Group.rotation.z = 0.28;
  ring1Group.rotation.y = 0.35;

  // Band
  const band1Geo = new THREE.TorusGeometry(0.78, 0.082, 32, 64);
  const band1 = new THREE.Mesh(band1Geo, primaryBandMaterial);
  band1.castShadow = true;
  band1.receiveShadow = true;
  ring1Group.add(band1);

  // 6 Prongs for solitaire setting
  const prongGroup = new THREE.Group();
  prongGroup.position.set(0, 0.78, 0);
  const prongCount = 6;
  const prongGeo = new THREE.CylinderGeometry(0.024, 0.028, 0.32, 12);
  for (let i = 0; i < prongCount; i++) {
    const angle = (i / prongCount) * Math.PI * 2;
    const prong = new THREE.Mesh(prongGeo, prongMaterial);
    prong.position.set(Math.cos(angle) * 0.22, 0.12, Math.sin(angle) * 0.22);
    prong.rotation.z = -Math.cos(angle) * 0.15;
    prong.rotation.x = Math.sin(angle) * 0.15;
    prong.castShadow = true;
    prongGroup.add(prong);
  }

  // Bezel basket rim
  const bezelRimGeo = new THREE.TorusGeometry(0.24, 0.022, 16, 32);
  const bezelRim = new THREE.Mesh(bezelRimGeo, prongMaterial);
  bezelRim.rotation.x = Math.PI / 2;
  bezelRim.position.y = 0.06;
  prongGroup.add(bezelRim);

  // Brilliant Diamond Gemstone
  const diamondGeo = createDiamondGeometry();
  const diamond = new THREE.Mesh(diamondGeo, diamondMaterial);
  diamond.scale.set(0.38, 0.38, 0.38);
  diamond.position.y = 0.22;
  diamond.castShadow = true;
  prongGroup.add(diamond);

  ring1Group.add(prongGroup);
  root.add(ring1Group);

  // Ring 2: Bumika's Comfort-Fit Band (Part 8 & 9)
  const ring2Group = new THREE.Group();
  ring2Group.name = 'RingBumika';
  ring2Group.position.set(0.55, 1.35, 0);
  ring2Group.rotation.z = -0.28;
  ring2Group.rotation.y = -0.35;

  // Wider masculine wedding band with subtle bevels
  const band2Geo = new THREE.TorusGeometry(0.85, 0.11, 32, 64);
  const band2 = new THREE.Mesh(band2Geo, secondaryBandMaterial);
  band2.castShadow = true;
  band2.receiveShadow = true;
  ring2Group.add(band2);

  // Inner beveled core
  const innerCoreGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.18, 36, 1, true);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.28,
    metalness: 0.9,
    side: THREE.DoubleSide,
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerMat);
  ring2Group.add(innerCore);

  root.add(ring2Group);

  // Part 10: Floating Petals (InstancedMesh)
  const petalCount = 45;
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.quadraticCurveTo(0.12, 0.2, 0.04, 0.38);
  petalShape.quadraticCurveTo(-0.06, 0.22, 0, 0);
  const petalGeo = new THREE.ShapeGeometry(petalShape);
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xd8dfcb, // Soft olive/ivory wedding petal
    roughness: 0.65,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const petalsMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
  petalsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  petalsMesh.frustumCulled = false;

  const dummy = new THREE.Object3D();
  const petalVelocities: { x: number; y: number; z: number; rotSpeed: number }[] = [];

  for (let i = 0; i < petalCount; i++) {
    const x = (Math.random() - 0.5) * 6;
    const y = 0.5 + Math.random() * 4.5;
    const z = (Math.random() - 0.5) * 6;
    const scale = 0.6 + Math.random() * 0.7;

    dummy.position.set(x, y, z);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    petalsMesh.setMatrixAt(i, dummy.matrix);

    // Warm gold vs olive petal tints
    const tintColor = Math.random() > 0.4 ? new THREE.Color(0xdce2d0) : new THREE.Color(0xf6e3b4);
    petalsMesh.setColorAt(i, tintColor);

    petalVelocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: -0.006 - Math.random() * 0.008,
      z: (Math.random() - 0.5) * 0.008,
      rotSpeed: 0.01 + Math.random() * 0.02,
    });
  }
  if (petalsMesh.instanceColor) petalsMesh.instanceColor.needsUpdate = true;
  petalsMesh.instanceMatrix.needsUpdate = true;
  root.add(petalsMesh);

  return {
    root,
    ring1Group,
    ring2Group,
    petalsMesh,
    petalVelocities,
    primaryBandMaterial,
    secondaryBandMaterial,
    diamondMaterial,
    prongMaterial,
  };
}

/**
 * Builds the composite Colombo Wedding Arch & Floral Pavilion Group.
 */
export function buildCeremonyArchScene(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
) {
  const root = new THREE.Group();
  root.name = 'ArchScene';
  root.scale.set(0.38, 0.38, 0.38);

  const marbleTex = createMarbleTexture(renderer);

  // Terrazzo Stage floor (Part 1)
  const floorGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.3, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xf5f3ec,
    map: marbleTex,
    roughness: 0.4,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = 0.15;
  floor.receiveShadow = true;
  root.add(floor);

  // Ground contact shadow (Part 2)
  const shadowGeo = new THREE.PlaneGeometry(10, 10);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  root.add(shadow);

  // Twin Fluted Columns (Part 3 & 4)
  const columnMat = new THREE.MeshStandardMaterial({
    color: 0xfbf9f5,
    roughness: 0.45,
    metalness: 0.08,
  });

  const columnBaseGeo = new THREE.BoxGeometry(0.7, 0.25, 0.7);
  const columnShaftGeo = new THREE.CylinderGeometry(0.24, 0.26, 3.8, 24);
  const columnCapitalGeo = new THREE.CylinderGeometry(0.38, 0.26, 0.25, 24);

  const columnPositions = [-1.8, 1.8];
  columnPositions.forEach((posX) => {
    const colGroup = new THREE.Group();
    colGroup.position.set(posX, 0.3, 0);

    const base = new THREE.Mesh(columnBaseGeo, columnMat);
    base.position.y = 0.125;
    base.castShadow = true;
    base.receiveShadow = true;
    colGroup.add(base);

    const shaft = new THREE.Mesh(columnShaftGeo, columnMat);
    shaft.position.y = 2.025;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    colGroup.add(shaft);

    const capital = new THREE.Mesh(columnCapitalGeo, columnMat);
    capital.position.y = 4.0;
    capital.castShadow = true;
    colGroup.add(capital);

    root.add(colGroup);
  });

  // Botanical Arch Overhead Curve (Part 5)
  const archCurve = new THREE.EllipseCurve(0, 4.15, 1.8, 1.35, 0, Math.PI, false, 0);
  const archPoints = archCurve.getPoints(36);
  const arch3DPoints = archPoints.map((p) => new THREE.Vector3(p.x, p.y, 0));
  const archCatmull = new THREE.CatmullRomCurve3(arch3DPoints);
  const archTubeGeo = new THREE.TubeGeometry(archCatmull, 48, 0.08, 12, false);
  const archWoodMat = new THREE.MeshStandardMaterial({
    color: 0x4a3a2a,
    roughness: 0.8,
    metalness: 0.1,
  });
  const archTube = new THREE.Mesh(archTubeGeo, archWoodMat);
  archTube.castShadow = true;
  root.add(archTube);

  // Instanced Lush Floral & Olive Leaf Clusters on the arch (Part 6)
  const foliageCount = 60;
  const leafGeo = new THREE.DodecahedronGeometry(0.18, 1);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x556b2f, // Olive green
    roughness: 0.6,
    metalness: 0.1,
  });
  const foliageMesh = new THREE.InstancedMesh(leafGeo, leafMat, foliageCount);
  foliageMesh.castShadow = true;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < foliageCount; i++) {
    const t = i / (foliageCount - 1);
    const pt = archCatmull.getPoint(t);
    dummy.position.set(
      pt.x + (Math.random() - 0.5) * 0.35,
      pt.y + (Math.random() - 0.5) * 0.35,
      pt.z + (Math.random() - 0.5) * 0.35
    );
    const s = 0.7 + Math.random() * 0.6;
    dummy.scale.set(s, s * 1.4, s);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.updateMatrix();
    foliageMesh.setMatrixAt(i, dummy.matrix);

    const tint = Math.random() > 0.35 ? new THREE.Color(0x556b2f) : new THREE.Color(0xf6f5ee);
    foliageMesh.setColorAt(i, tint);
  }
  if (foliageMesh.instanceColor) foliageMesh.instanceColor.needsUpdate = true;
  foliageMesh.instanceMatrix.needsUpdate = true;
  root.add(foliageMesh);

  // Draped Silk Fabric Canopy (Part 7)
  const draperyCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, 4.0, 0.1),
    new THREE.Vector3(-0.9, 4.8, 0.2),
    new THREE.Vector3(0, 5.0, 0.15),
    new THREE.Vector3(0.9, 4.8, 0.2),
    new THREE.Vector3(1.8, 4.0, 0.1),
  ]);
  const drapeGeo = new THREE.TubeGeometry(draperyCurve, 32, 0.14, 16, false);
  const drapeMat = new THREE.MeshStandardMaterial({
    color: 0xfffcf5,
    roughness: 0.9,
    metalness: 0.05,
  });
  const drapeMesh = new THREE.Mesh(drapeGeo, drapeMat);
  drapeMesh.castShadow = true;
  root.add(drapeMesh);

  // Twin Warm Glowing Lanterns (Part 8)
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.2,
  });
  [-1.3, 1.3].forEach((lx) => {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(lx, 3.8, 0);

    const cordGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 8);
    const cord = new THREE.Mesh(cordGeo, lanternMat);
    cord.position.y = -0.3;
    lanternGroup.add(cord);

    const cageGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.32, 6);
    const cage = new THREE.Mesh(cageGeo, lanternMat);
    cage.position.y = -0.65;
    lanternGroup.add(cage);

    // Glowing candle inside
    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12);
    const candleMat = new THREE.MeshBasicMaterial({ color: 0xffdf88 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = -0.65;
    lanternGroup.add(candle);

    if (!isSoftwareGl) {
      const pLight = new THREE.PointLight(0xffa540, 1.2, 3);
      pLight.position.y = -0.65;
      lanternGroup.add(pLight);
    }

    root.add(lanternGroup);
  });

  return { root, foliageMesh };
}

/**
 * Builds the composite Celebration & Champagne Toast Group.
 */
export function buildCelebrationToastScene(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
) {
  const root = new THREE.Group();
  root.name = 'ToastScene';
  root.scale.set(0.65, 0.65, 0.65);

  const marbleTex = createMarbleTexture(renderer);

  // Banquet pedestal table (Part 1)
  const tableGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.5, 48);
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0xf5f3ea,
    map: marbleTex,
    roughness: 0.3,
    metalness: 0.1,
  });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = 0.25;
  table.receiveShadow = true;
  root.add(table);

  // Contact shadow
  const shadowGeo = new THREE.PlaneGeometry(6, 6);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  root.add(shadow);

  // Crystal glass material
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: isSoftwareGl ? 0 : 0.95,
    opacity: isSoftwareGl ? 0.35 : 1.0,
    transparent: true,
    roughness: 0.05,
    metalness: 0.05,
    ior: 1.52,
    thickness: 0.8,
  });

  // Champagne liquid material
  const champagneMat = new THREE.MeshPhysicalMaterial({
    color: 0xfce8aa,
    transmission: isSoftwareGl ? 0 : 0.85,
    opacity: isSoftwareGl ? 0.6 : 0.9,
    transparent: true,
    roughness: 0.1,
    metalness: 0.05,
    ior: 1.34,
  });

  const goldRimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15,
  });

  // Build two flutes clinking gently (Part 2 & 3)
  [-0.6, 0.6].forEach((fx, idx) => {
    const fluteGroup = new THREE.Group();
    fluteGroup.position.set(fx, 0.5, 0);
    fluteGroup.rotation.z = idx === 0 ? 0.12 : -0.12;

    // Base foot
    const footGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.04, 32);
    const foot = new THREE.Mesh(footGeo, glassMat);
    foot.position.y = 0.02;
    fluteGroup.add(foot);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.038, 0.045, 1.2, 16);
    const stem = new THREE.Mesh(stemGeo, glassMat);
    stem.position.y = 0.62;
    fluteGroup.add(stem);

    // Flute bowl
    const bowlGeo = new THREE.CylinderGeometry(0.34, 0.12, 1.4, 32, 1, true);
    const bowl = new THREE.Mesh(bowlGeo, glassMat);
    bowl.position.y = 1.9;
    fluteGroup.add(bowl);

    // Gold rim
    const rimGeo = new THREE.TorusGeometry(0.34, 0.014, 16, 32);
    const rim = new THREE.Mesh(rimGeo, goldRimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 2.6;
    fluteGroup.add(rim);

    // Liquid fill
    const liquidGeo = new THREE.CylinderGeometry(0.32, 0.13, 0.95, 32);
    const liquid = new THREE.Mesh(liquidGeo, champagneMat);
    liquid.position.y = 1.7;
    fluteGroup.add(liquid);

    root.add(fluteGroup);
  });

  return { root };
}
