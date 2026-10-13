import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { useClassData } from '../context/ClassDataContext';
import { SeatingChart2D } from './SeatingChart2D';
import {
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Camera,
  Play,
  Pause,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const Classroom3D: React.FC = () => {
  const { students, setSelectedStudent } = useClassData();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [chalkboardClicked, setChalkboardClicked] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const deskGroupsRef = useRef<Map<string, { group: THREE.Group; initialY: number; student: Student }>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-100, -100));
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3.8, radius: 26 });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const autoRotateRef = useRef(false);
  autoRotateRef.current = autoRotate;

  // Chalkboard trigger easter egg
  const handleChalkboardClick = () => {
    setChalkboardClicked(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#A7F3D0', '#FB7185', '#C4B5FD', '#FFF9F0'],
    });
    setTimeout(() => setChalkboardClicked(false), 4000);
  };

  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current || !containerRef.current) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        setViewMode('2d');
        return;
      }
    } catch {
      setWebGlSupported(false);
      setViewMode('2d');
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 540;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x132035);
    scene.fog = new THREE.FogExp2(0x132035, 0.016);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(-15, 18, -10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    scene.add(sunLight);

    // Warm rim light from back-right
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    rimLight.position.set(15, 12, 12);
    scene.add(rimLight);

    // Warm floor
    const floorGeo = new THREE.PlaneGeometry(28, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x8b5e34,
      roughness: 0.65,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle parquet lines on floor
    const gridHelper = new THREE.GridHelper(26, 26, 0x5c3b1e, 0x6e4726);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Classroom Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf4ede2,
      roughness: 0.9,
    });

    // Back wall (behind chalkboard)
    const backWallGeo = new THREE.PlaneGeometry(28, 12);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 6, -12);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall with window cutouts
    const leftWallGeo = new THREE.PlaneGeometry(28, 12);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-13, 6, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Left wall window frames
    for (let w = -7; w <= 7; w += 7) {
      const windowFrameGeo = new THREE.BoxGeometry(0.2, 5, 4);
      const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
      windowFrame.position.set(-12.8, 6.5, w);
      scene.add(windowFrame);

      // Soft sun glow inside window
      const windowGlassGeo = new THREE.PlaneGeometry(3.6, 4.6);
      const windowGlassMat = new THREE.MeshBasicMaterial({
        color: 0xfffae6,
        transparent: true,
        opacity: 0.45,
      });
      const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
      windowGlass.rotation.y = Math.PI / 2;
      windowGlass.position.set(-12.7, 6.5, w);
      scene.add(windowGlass);
    }

    // Classroom Board (Blackboard)
    const boardCanvas = document.createElement('canvas');
    boardCanvas.width = 1024;
    boardCanvas.height = 512;
    const ctx = boardCanvas.getContext('2d');
    if (ctx) {
      // Chalkboard background
      ctx.fillStyle = '#172e27';
      ctx.fillRect(0, 0, 1024, 512);

      // Subtle chalk smudges
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wooden border inner rim
      ctx.strokeStyle = '#c49a6c';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, 1004, 492);

      // Chalkboard text
      ctx.font = 'bold 64px "Playfair Display", serif';
      ctx.fillStyle = '#fef3c7';
      ctx.textAlign = 'center';
      ctx.fillText('CLASS HOME', 512, 180);

      ctx.font = 'italic 28px "Playfair Display", serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText('“Birimiz hamma uchun, hammamiz birimiz uchun”', 512, 260);

      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Our Class, Our Memories · 14 Students', 512, 330);

      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('(Click board for class oath celebration)', 512, 430);
    }

    const boardTexture = new THREE.CanvasTexture(boardCanvas);
    const boardGeo = new THREE.BoxGeometry(14, 6.5, 0.2);
    const boardMat = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.8,
    });
    const chalkboard = new THREE.Mesh(boardGeo, boardMat);
    chalkboard.position.set(0, 6, -11.8);
    chalkboard.name = 'chalkboard';
    scene.add(chalkboard);

    // Teacher's Desk at the front
    const teacherDeskGroup = new THREE.Group();
    const tDeskTopGeo = new THREE.BoxGeometry(5, 0.25, 2.2);
    const tDeskMat = new THREE.MeshStandardMaterial({ color: 0x5a381e, roughness: 0.5 });
    const tDeskTop = new THREE.Mesh(tDeskTopGeo, tDeskMat);
    tDeskTop.position.set(0, 1.8, -8);
    tDeskTop.castShadow = true;
    teacherDeskGroup.add(tDeskTop);

    // Teacher desk legs
    const tLegGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const tPositions = [
      [-2.3, 0.9, -7.1],
      [2.3, 0.9, -7.1],
      [-2.3, 0.9, -8.9],
      [2.3, 0.9, -8.9],
    ];
    tPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(tLegGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      teacherDeskGroup.add(leg);
    });

    // Globe on teacher's desk
    const globeStandGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.4);
    const globeStand = new THREE.Mesh(globeStandGeo, legMat);
    globeStand.position.set(-1.6, 2.1, -8);
    teacherDeskGroup.add(globeStand);

    const globeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const globeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(-1.6, 2.45, -8);
    teacherDeskGroup.add(globe);

    scene.add(teacherDeskGroup);

    // BUILD 14 INDIVIDUAL STUDENT DESKS
    deskGroupsRef.current.clear();

    // Classroom desk positioning:
    // Row 1: z = -4.5
    // Row 2: z = -1.5
    // Row 3: z = 1.5
    // Row 4: z = 4.5
    // X coordinates: for 4 desks: [-5.2, -1.8, 1.8, 5.2]
    // for 2 desks (Row 4): [-1.8, 1.8]
    const rowZ = [-4.5, -1.5, 1.8, 5.0];
    const col4X = [-5.5, -1.8, 1.8, 5.5];
    const col2X = [-1.8, 1.8];

    students.forEach((student) => {
      const deskGroup = new THREE.Group();
      deskGroup.name = `desk-${student.id}`;

      // Calculate position
      let posX = 0;
      const posZ = rowZ[student.row - 1] || 0;
      if (student.row <= 3) {
        posX = col4X[student.col - 1] || 0;
      } else {
        // Row 4 has 2 center desks (col 2, col 3)
        posX = student.col === 2 ? col2X[0] : col2X[1];
      }

      const initialY = 0;
      deskGroup.position.set(posX, initialY, posZ);

      // Desk tabletop
      const deskTopGeo = new THREE.BoxGeometry(2.4, 0.18, 1.5);
      const deskTopMat = new THREE.MeshStandardMaterial({
        color: 0xa87342,
        roughness: 0.6,
      });
      const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
      deskTop.position.set(0, 1.45, 0);
      deskTop.castShadow = true;
      deskTop.receiveShadow = true;
      deskGroup.add(deskTop);

      // Desk frame & 4 metal legs
      const deskLegGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.45);
      const dLegMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const dLegCoords = [
        [-1.05, 0.725, -0.6],
        [1.05, 0.725, -0.6],
        [-1.05, 0.725, 0.6],
        [1.05, 0.725, 0.6],
      ];
      dLegCoords.forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(deskLegGeo, dLegMat);
        leg.position.set(lx, ly, lz);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      // Chair
      const chairSeatGeo = new THREE.BoxGeometry(1.2, 0.12, 1.1);
      const chairMat = new THREE.MeshStandardMaterial({ color: 0x855428, roughness: 0.7 });
      const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat);
      chairSeat.position.set(0, 0.9, 1.1);
      chairSeat.castShadow = true;
      deskGroup.add(chairSeat);

      // Chair backrest
      const backrestGeo = new THREE.BoxGeometry(1.2, 0.7, 0.1);
      const backrest = new THREE.Mesh(backrestGeo, chairMat);
      backrest.position.set(0, 1.5, 1.55);
      backrest.castShadow = true;
      deskGroup.add(backrest);

      // Chair legs
      const chairLegCoords = [
        [-0.5, 0.45, 0.7],
        [0.5, 0.45, 0.7],
        [-0.5, 0.45, 1.5],
        [0.5, 0.45, 1.5],
      ];
      chairLegCoords.forEach(([cx, cy, cz]) => {
        const cLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), dLegMat);
        cLeg.position.set(cx, cy, cz);
        cLeg.castShadow = true;
        deskGroup.add(cLeg);
      });

      // 3D Notebook on desk with student's accent color
      const bookGeo = new THREE.BoxGeometry(0.65, 0.06, 0.85);
      const accentHex = parseInt(student.accentColor.replace('#', '0x'), 16) || 0x3b82f6;
      const bookMat = new THREE.MeshStandardMaterial({
        color: accentHex,
        roughness: 0.4,
      });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(-0.5, 1.58, 0.1);
      book.rotation.y = 0.15;
      book.castShadow = true;
      deskGroup.add(book);

      // Pencil next to book
      const pencilGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
      const pencilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const pencil = new THREE.Mesh(pencilGeo, pencilMat);
      pencil.rotation.z = Math.PI / 2;
      pencil.position.set(0.1, 1.56, 0.2);
      deskGroup.add(pencil);

      // Student Nameplate (Canvas Texture mounted on wooden wedge in front of desk)
      const nameplateCanvas = document.createElement('canvas');
      nameplateCanvas.width = 512;
      nameplateCanvas.height = 140;
      const npCtx = nameplateCanvas.getContext('2d');
      if (npCtx) {
        npCtx.fillStyle = '#0f172a';
        npCtx.fillRect(0, 0, 512, 140);

        // Accent top border
        npCtx.fillStyle = student.accentColor || '#3B82F6';
        npCtx.fillRect(0, 0, 512, 12);

        // Name
        npCtx.fillStyle = '#ffffff';
        npCtx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
        npCtx.textAlign = 'center';
        npCtx.fillText(student.name, 256, 75);

        // Desk Number
        npCtx.fillStyle = '#94a3b8';
        npCtx.font = '22px "JetBrains Mono", monospace';
        npCtx.fillText(`Desk #${student.deskNumber}`, 256, 115);
      }
      const nameplateTexture = new THREE.CanvasTexture(nameplateCanvas);
      const nameplateGeo = new THREE.BoxGeometry(1.6, 0.4, 0.06);
      const nameplateMat = new THREE.MeshStandardMaterial({
        map: nameplateTexture,
        roughness: 0.3,
      });
      const nameplate = new THREE.Mesh(nameplateGeo, nameplateMat);
      nameplate.position.set(0, 1.7, -0.65);
      nameplate.rotation.x = -0.2; // tilted towards viewer
      nameplate.castShadow = true;
      deskGroup.add(nameplate);

      // Floating interactive beacon diamond above desk
      const markerGeo = new THREE.OctahedronGeometry(0.2, 0);
      const markerMat = new THREE.MeshStandardMaterial({
        color: accentHex,
        emissive: accentHex,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(0, 2.5, 0);
      marker.name = 'beacon';
      deskGroup.add(marker);

      scene.add(deskGroup);

      deskGroupsRef.current.set(student.id, {
        group: deskGroup,
        initialY,
        student,
      });
    });

    // Handle mouse drag / touch for camera orbit
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        cameraAngleRef.current.theta -= deltaX * 0.006;
        cameraAngleRef.current.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2.1, cameraAngleRef.current.phi - deltaY * 0.006)
        );

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(
        12,
        Math.min(36, cameraAngleRef.current.radius + e.deltaY * 0.02)
      );
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        cameraAngleRef.current.theta -= deltaX * 0.008;
        cameraAngleRef.current.phi = Math.max(
          0.15,
          Math.min(Math.PI / 2.1, cameraAngleRef.current.phi - deltaY * 0.008)
        );

        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Click handler for desks & chalkboard
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;

        // Check if chalkboard
        while (currentObj) {
          if (currentObj.name === 'chalkboard') {
            handleChalkboardClick();
            return;
          }
          if (currentObj.name?.startsWith('desk-')) {
            const studentId = currentObj.name.replace('desk-', '');
            const targetStudent = students.find((s) => s.id === studentId);
            if (targetStudent) {
              setSelectedStudent(targetStudent);
              return;
            }
          }
          currentObj = currentObj.parent;
        }
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 540;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation if enabled
      if (autoRotateRef.current && !isDraggingRef.current) {
        cameraAngleRef.current.theta += 0.003;
      }

      // Update camera position using spherical coordinates
      const { theta, phi, radius } = cameraAngleRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(targetLookAtRef.current);

      // Raycasting for hover detection
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      let foundHoveredStudentId: string | null = null;

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj) {
          if (hitObj.name?.startsWith('desk-')) {
            foundHoveredStudentId = hitObj.name.replace('desk-', '');
            break;
          }
          hitObj = hitObj.parent;
        }
      }

      // Update hovered state in React
      if (foundHoveredStudentId) {
        const matched = students.find((s) => s.id === foundHoveredStudentId);
        if (matched) {
          setHoveredStudent(matched);
        }
      } else {
        setHoveredStudent(null);
      }

      // Animate desks and markers
      deskGroupsRef.current.forEach(({ group, student }) => {
        const isHovered = student.id === foundHoveredStudentId;
        const targetY = isHovered ? 0.35 : 0;
        // Smooth lerp Y elevation
        group.position.y += (targetY - group.position.y) * 0.15;

        // Animate floating diamond beacon
        const beacon = group.getObjectByName('beacon');
        if (beacon) {
          beacon.rotation.y += 0.03;
          beacon.position.y = 2.4 + Math.sin(elapsedTime * 2 + student.deskNumber) * 0.08;
          if (isHovered) {
            beacon.scale.set(1.4, 1.4, 1.4);
          } else {
            beacon.scale.set(1, 1, 1);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [viewMode, students, setSelectedStudent]);

  // Camera preset buttons
  const setPresetAngle = (theta: number, phi: number, radius: number) => {
    cameraAngleRef.current = { theta, phi, radius };
    setAutoRotate(false);
  };

  return (
    <section id="classroom" className="py-16 md:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              <span>Interactive Space</span>
              <span aria-hidden="true">·</span>
              <span>14 Dedicated Student Stations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
              The Virtual Classroom
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              Rotate, explore, and click any of the 14 student desks to step into their personal memories and yearbook story.
            </p>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1 bg-slate-800 rounded-lg flex items-center border border-slate-700">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === '3d'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Spatial View</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === '2d'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Seating Plan</span>
              </button>
            </div>

            {viewMode === '3d' && (
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  autoRotate
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Toggle Slow Auto-Tour"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Tour Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D Scene Container / 2D Fallback */}
        {viewMode === '3d' ? (
          <div
            ref={containerRef}
            className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#132035] select-none"
          >
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Top-Left Camera View Presets */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-[11px] font-mono text-slate-400 px-2 hidden sm:inline">
                Camera:
              </span>
              <button
                onClick={() => setPresetAngle(Math.PI / 4, Math.PI / 3.8, 26)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Angle
              </button>
              <button
                onClick={() => setPresetAngle(0, Math.PI / 3.2, 22)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Front
              </button>
              <button
                onClick={() => setPresetAngle(0, 0.15, 27)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Top-Down
              </button>
              <button
                onClick={() => setPresetAngle(Math.PI / 4, Math.PI / 3.8, 26)}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Blackboard easter egg banner */}
            {chalkboardClicked && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-lg text-xs animate-bounce flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Class Oath: “Birimiz hamma uchun, hammamiz birimiz uchun!”</span>
              </div>
            )}

            {/* Bottom-Left Controls Helper */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs text-slate-300 pointer-events-none hidden sm:flex items-center gap-2">
              <span>Drag to rotate</span>
              <span aria-hidden="true">·</span>
              <span>Scroll to zoom</span>
              <span aria-hidden="true">·</span>
              <span>Click desk to view student</span>
            </div>

            {/* Interactive Hover HUD Preview Card */}
            {hoveredStudent && (
              <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl w-72 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-400 shrink-0">
                    <img
                      src={hoveredStudent.avatar}
                      alt={hoveredStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-blue-400">
                      Desk #{hoveredStudent.deskNumber}
                    </div>
                    <div className="text-base font-bold text-white truncate">
                      {hoveredStudent.name}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Station Active</span>
                  <button
                    onClick={() => setSelectedStudent(hoveredStudent)}
                    className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-1 transition-colors"
                  >
                    <span>Open Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <SeatingChart2D />
        )}
      </div>
    </section>
  );
};
