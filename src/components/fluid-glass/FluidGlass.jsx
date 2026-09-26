/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1783394327207-acf441e37dda?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzR8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzZ8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1782094002386-7d9ae1f49f50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDB8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1779684474703-5c0519bcf7e8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NTJ8fHxlbnwwfHx8fHw%3D'
];

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundColor = 'transparent',
  textColor = '#f3f4f6',
  highlightColor = '#7dd3fc',
  mainText,
  highlightText,
  children
}) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  const hasCustomContent = Boolean(children || mainText || highlightText);

  let content;
  if (children) {
    content = (
      <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
        {children}
        <Preload />
      </Wrapper>
    );
  } else if (mainText || highlightText) {
    content = (
      <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
        <AboutTextContent
          mainText={mainText}
          highlightText={highlightText}
          textColor={textColor}
          highlightColor={highlightColor}
        />
        <Preload />
      </Wrapper>
    );
  } else {
    // Default demo scene from React Bits
    content = (
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === 'bar' && <NavItems items={navItems} textColor={textColor} />}
        <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
          <Scroll>
            <Typography textColor={textColor} />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor }}
    >
      <ambientLight intensity={1.2} />
      {content}
    </Canvas>
  );
}

/**
 * Renders the MLSC About section text in 3D using signed distance field text,
 * dynamically scaled and positioned to fit inside the FBO scene with rich visual hierarchy.
 */
function AboutTextContent({
  mainText = '',
  highlightText = '',
  textColor = '#ffffff',
  highlightColor = '#38bdf8'
}) {
  const { viewport, camera } = useThree();
  const v = viewport.getCurrentViewport(camera, [0, 0, 12]);

  const isMobile = v.width < 3.2;
  const isTablet = v.width >= 3.2 && v.width < 5.0;

  // Split mainText into orgTitle, lead, activities, and quote
  let orgTitle = '';
  let leadText = '';
  let activitiesText = '';
  let quoteText = '';
  const punchlineText = highlightText || 'A space to learn, create, collaborate, and make an impact.';

  if (mainText) {
    const quoteRegex = /["“](Technology is best learned when it is explored together)["”]\.?/i;
    const qMatch = mainText.match(quoteRegex);
    if (qMatch) {
      quoteText = `"${qMatch[1]}".`;
      const beforeQuote = mainText.slice(0, qMatch.index).trim();
      const splitIdx = beforeQuote.indexOf('From hands-on');
      let p1 = '';
      if (splitIdx !== -1) {
        p1 = beforeQuote.slice(0, splitIdx).trim();
        activitiesText = beforeQuote.slice(splitIdx).trim();
      } else {
        p1 = beforeQuote;
      }

      const orgPrefix = 'Microsoft Learn Student Chapter PCCOE';
      if (p1.startsWith(orgPrefix)) {
        orgTitle = orgPrefix;
        leadText = p1.slice(orgPrefix.length).trim();
      } else {
        orgTitle = '';
        leadText = p1;
      }
    } else {
      leadText = mainText;
    }
  }

  const maxWidth = isMobile
    ? v.width * 0.92
    : isTablet
    ? Math.min(v.width * 0.90, 5.4)
    : Math.min(v.width * 0.88, 6.8);

  const orgFontSize = isMobile
    ? Math.min(v.width / 31, 0.090)
    : isTablet
    ? Math.min(v.width / 34, 0.115)
    : Math.min(v.width / 38, 0.126);

  const leadFontSize = isMobile
    ? Math.min(v.width / 39, 0.075)
    : isTablet
    ? Math.min(v.width / 45, 0.092)
    : Math.min(v.width / 49, 0.098);

  const actFontSize = isMobile
    ? Math.min(v.width / 41, 0.070)
    : isTablet
    ? Math.min(v.width / 46, 0.088)
    : Math.min(v.width / 51, 0.093);

  const quoteFontSize = isMobile
    ? Math.min(v.width / 32, 0.086)
    : isTablet
    ? Math.min(v.width / 37, 0.106)
    : Math.min(v.width / 41, 0.114);

  const punchFontSize = isMobile
    ? Math.min(v.width / 29, 0.094)
    : isTablet
    ? Math.min(v.width / 34, 0.120)
    : Math.min(v.width / 37, 0.128);

  // Background solid color circles (reverted to 4 clean solid color circles)
  const bgCircles = (
    <group position={[0, 0, -1]}>
      {/* 1. Soft Microsoft Blue top-left */}
      <mesh position={[-v.width * 0.36, v.height * 0.32, 0]}>
        <circleGeometry args={[v.width * 0.28, 32]} />
        <meshBasicMaterial color="#00A4EF" opacity={0.075} transparent toneMapped={false} />
      </mesh>

      {/* 2. Soft Microsoft Gold bottom-right */}
      <mesh position={[v.width * 0.36, -v.height * 0.30, 0]}>
        <circleGeometry args={[v.width * 0.28, 32]} />
        <meshBasicMaterial color="#FFB900" opacity={0.065} transparent toneMapped={false} />
      </mesh>

      {/* 3. Soft Microsoft Red bottom-left */}
      <mesh position={[-v.width * 0.40, -v.height * 0.35, 0]}>
        <circleGeometry args={[v.width * 0.20, 32]} />
        <meshBasicMaterial color="#F25022" opacity={0.045} transparent toneMapped={false} />
      </mesh>

      {/* 4. Soft Microsoft Green top-right */}
      <mesh position={[v.width * 0.40, v.height * 0.35, 0]}>
        <circleGeometry args={[v.width * 0.20, 32]} />
        <meshBasicMaterial color="#7FBA00" opacity={0.045} transparent toneMapped={false} />
      </mesh>
    </group>
  );

  // If quote wasn't matched, provide balanced fallback
  if (!quoteText && !activitiesText) {
    return (
      <group position={[0, 0, 12]}>
        {bgCircles}
        {leadText && (
          <Text
            position={[0, 0.22, 0]}
            fontSize={leadFontSize}
            lineHeight={1.34}
            maxWidth={maxWidth}
            textAlign="center"
            color={textColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0}
            outlineBlur="20%"
            outlineColor="#000000"
            outlineOpacity={0.4}
          >
            {leadText}
          </Text>
        )}
        {punchlineText && (
          <Text
            position={[0, -0.68, 0]}
            fontSize={punchFontSize}
            lineHeight={1.22}
            maxWidth={maxWidth}
            textAlign="center"
            color={highlightColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0}
            outlineBlur="25%"
            outlineColor="#000000"
            outlineOpacity={0.5}
          >
            {punchlineText}
          </Text>
        )}
      </group>
    );
  }

  const activitiesColorRanges = useMemo(() => {
    if (!activitiesText) return null;
    const base = '#e2e8f0';
    const ranges = { 0: base };
    const bIdx = activitiesText.indexOf('BlueBit');
    if (bIdx !== -1) {
      ranges[bIdx] = '#1EAEF7';
      ranges[bIdx + 'BlueBit'.length] = base;
    }
    const tIdx = activitiesText.indexOf('TechRoom');
    if (tIdx !== -1) {
      ranges[tIdx] = '#FF643D';
      ranges[tIdx + 'TechRoom'.length] = base;
    }
    const pIdx = activitiesText.indexOf('Praxis');
    if (pIdx !== -1) {
      ranges[pIdx] = '#4ADE80';
      ranges[pIdx + 'Praxis'.length] = base;
    }
    return ranges;
  }, [activitiesText]);

  const punchlineColorRanges = useMemo(() => {
    if (!punchlineText) return null;
    const base = '#ffffff';
    const ranges = { 0: base };
    const lIdx = punchlineText.indexOf('learn');
    if (lIdx !== -1) {
      ranges[lIdx] = '#1EAEF7';
      ranges[lIdx + 'learn'.length] = base;
    }
    const c1Idx = punchlineText.indexOf('create');
    if (c1Idx !== -1) {
      ranges[c1Idx] = '#FF643D';
      ranges[c1Idx + 'create'.length] = base;
    }
    const c2Idx = punchlineText.indexOf('collaborate');
    if (c2Idx !== -1) {
      ranges[c2Idx] = '#FFB900';
      ranges[c2Idx + 'collaborate'.length] = base;
    }
    const impIdx = punchlineText.indexOf('make an impact');
    if (impIdx !== -1) {
      ranges[impIdx] = '#4ADE80';
      ranges[impIdx + 'make an impact'.length] = base;
    }
    return ranges;
  }, [punchlineText]);

  // Responsive vertical coordinates based on visible viewport height (tight & compact layout)
  const orgY = isMobile ? v.height * 0.31 : v.height * 0.27;
  const leadY = isMobile ? v.height * 0.14 : v.height * 0.12;
  const actY = isMobile ? -v.height * 0.03 : -v.height * 0.03;
  const quoteY = isMobile ? -v.height * 0.18 : -v.height * 0.17;
  const punchY = isMobile ? -v.height * 0.30 : -v.height * 0.28;

  return (
    <group position={[0, 0, 12]}>
      {/* Static solid color circles in the background */}
      {bgCircles}

      {/* Tier 1: Prominent Organization Header */}
      {orgTitle && (
        <Text
          position={[0, orgY, 0]}
          fontSize={orgFontSize}
          lineHeight={1.15}
          letterSpacing={-0.01}
          maxWidth={maxWidth}
          textAlign="center"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000000"
          outlineOpacity={0.5}
        >
          {orgTitle}
        </Text>
      )}

      {/* Tier 2: Community Purpose & Curiosity */}
      {leadText && (
        <Text
          position={[0, leadY, 0]}
          fontSize={leadFontSize}
          lineHeight={1.34}
          maxWidth={maxWidth}
          textAlign="center"
          color="#f1f5f9"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000000"
          outlineOpacity={0.4}
        >
          {leadText}
        </Text>
      )}

      {/* Tier 3: Activities & Belief Introduction */}
      {activitiesText && (
        <Text
          position={[0, actY, 0]}
          fontSize={actFontSize}
          lineHeight={1.32}
          maxWidth={maxWidth}
          textAlign="center"
          color="#e2e8f0"
          colorRanges={activitiesColorRanges}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000000"
          outlineOpacity={0.4}
        >
          {activitiesText}
        </Text>
      )}

      {/* Tier 4: Core Inspiring Belief Quote (Microsoft Gold) */}
      {quoteText && (
        <Text
          position={[0, quoteY, 0]}
          fontSize={quoteFontSize}
          lineHeight={1.22}
          maxWidth={maxWidth}
          textAlign="center"
          color="#FFB900"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="25%"
          outlineColor="#000000"
          outlineOpacity={0.5}
        >
          {quoteText}
        </Text>
      )}

      {/* Tier 5: The Mission Anchor (Microsoft 4-Color Harmony / Electric Cyan) */}
      {punchlineText && (
        <Text
          position={[0, punchY, 0]}
          fontSize={punchFontSize}
          lineHeight={1.22}
          letterSpacing={0.02}
          maxWidth={maxWidth}
          textAlign="center"
          color="#ffffff"
          colorRanges={punchlineColorRanges}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="25%"
          outlineColor="#000000"
          outlineOpacity={0.5}
        >
          {punchlineText}
        </Text>
      )}
    </group>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  backgroundColor = 'transparent',
  ...props
}) {
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp, gl } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  // Track cursor hover state so glass lens only appears when cursor is inside the box
  const isHoveredRef = useRef(false);
  const currentScaleRef = useRef(0);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const box = document.getElementById('about-glass-box') || gl.domElement;
    const canvas = gl.domElement;

    const onEnter = () => {
      isHoveredRef.current = true;
    };
    const onLeave = () => {
      isHoveredRef.current = false;
    };

    box.addEventListener('pointerenter', onEnter);
    box.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);

    // Initial check if mouse is already inside box on page load
    const checkInitial = (e) => {
      const rect = box.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isHoveredRef.current = true;
      }
    };
    window.addEventListener('pointermove', checkInitial, { once: true });

    return () => {
      box.removeEventListener('pointerenter', onEnter);
      box.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointermove', checkInitial);
    };
  }, [gl]);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    geo?.computeBoundingBox();
    if (geo?.boundingBox) {
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera, clock } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const isHovered = isHoveredRef.current;
    const maxWorld = v.width * 0.9;
    const desired = maxWorld / geoWidthRef.current;
    const baseScale = modeProps.scale ?? Math.min(0.18, desired);
    // Lens bubble disabled — it overlapped the text. Background circles and text remain.
    const targetScale = 0;

    // Smoothly animate scale up on enter, and quickly collapse to 0 on exit
    const dampTime = isHovered ? 0.12 : 0.08;
    easing.damp(currentScaleRef, 'current', targetScale, dampTime, delta);

    if (ref.current) {
      const curScale = currentScaleRef.current;
      ref.current.scale.setScalar(curScale);
      ref.current.visible = curScale > 0.003;

      if (isHovered) {
        const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
        const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;

        // On first entrance or when popping back in from outside, snap position so it emerges under cursor
        if (!hasEnteredRef.current || curScale < 0.02) {
          ref.current.position.set(destX, destY, 15);
          hasEnteredRef.current = true;
        } else {
          easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
        }

        // Lock rotation strictly perpendicular to camera so it remains a proper, perfect circle at all times
        ref.current.rotation.set(Math.PI / 2, 0, 0);
      }
    }

    if (backgroundColor && backgroundColor !== 'transparent') {
      gl.setClearColor(backgroundColor, 1);
    } else {
      gl.setClearColor(0x000000, 0);
    }
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, distortion, distortionScale, temporalDistortion, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(
        <>
          {backgroundColor && backgroundColor !== 'transparent' && (
            <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
              <planeGeometry />
              <meshBasicMaterial color={backgroundColor} toneMapped={false} />
            </mesh>
          )}
          {children}
        </>,
        scene
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
      </mesh>
      <mesh ref={ref} scale={0} visible={false} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry} {...props}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.38}
          thickness={thickness ?? 0.85}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.007}
          roughness={0}
          transmission={1}
          distortion={distortion ?? 0.60}
          distortionScale={distortionScale ?? 0.40}
          temporalDistortion={temporalDistortion ?? 0.30}
          color="#ffffff"
          attenuationColor="#ffffff"
          {...extraMat}
        />
        {/* Crisp, clearly distinguishable glass border */}
        <mesh position={[0, 0.21, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.95, 1.02, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.21, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.88, 0.95, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.25} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.208, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[1.02, 1.06, 64]} />
          <meshBasicMaterial color="#000000" opacity={0.4} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items, textColor }) {
  const group = useRef();
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = link => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          depthTest={false}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef();
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1, 1]} url={IMAGE_URLS[0]} />
      <Image position={[2, 0, 3]} scale={3} url={IMAGE_URLS[1]} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url={IMAGE_URLS[2]} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url={IMAGE_URLS[3]} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={IMAGE_URLS[4]} />
    </group>
  );
}

function Typography({ textColor }) {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}
