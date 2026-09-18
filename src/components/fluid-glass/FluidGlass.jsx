/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
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
 * dynamically scaled and positioned to fit inside the FBO scene.
 */
function AboutTextContent({
  mainText = '',
  highlightText = '',
  textColor = '#f3f4f6',
  highlightColor = '#7dd3fc'
}) {
  const { viewport, camera } = useThree();
  const v = viewport.getCurrentViewport(camera, [0, 0, 12]);

  const isMobile = v.width < 3.2;
  const isTablet = v.width >= 3.2 && v.width < 5.0;

  const maxWidth = isMobile
    ? v.width * 0.90
    : isTablet
    ? Math.min(v.width * 0.86, 4.8)
    : Math.min(v.width * 0.82, 5.8);

  const mainFontSize = isMobile
    ? Math.min(v.width / 36, v.height / 24, 0.072)
    : isTablet
    ? Math.min(v.width / 44, 0.088)
    : Math.min(v.width / 48, 0.102);

  const highlightFontSize = isMobile
    ? Math.min(v.width / 30, v.height / 20, 0.082)
    : isTablet
    ? Math.min(v.width / 36, 0.108)
    : Math.min(v.width / 40, 0.125);

  const mainY = isMobile ? 0.26 : 0.22;
  const highlightY = isMobile ? -0.72 : -0.68;

  return (
    <group position={[0, 0, 12]}>
      {mainText && (
        <Text
          position={[0, mainY, 0]}
          fontSize={mainFontSize}
          lineHeight={1.55}
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
          {mainText}
        </Text>
      )}
      {highlightText && (
        <Text
          position={[0, highlightY, 0]}
          fontSize={highlightFontSize}
          lineHeight={1.35}
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
          {highlightText}
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
    const baseScale = modeProps.scale ?? Math.min(0.28, desired);
    const targetScale = isHovered ? baseScale : 0;

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

    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

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
          ior={ior ?? 1.15}
          thickness={thickness ?? 3.0}
          anisotropy={anisotropy ?? 0}
          chromaticAberration={chromaticAberration ?? 0.02}
          roughness={0}
          transmission={1}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          color="#ffffff"
          attenuationColor="#ffffff"
          attenuationDistance={1.0}
          {...extraMat}
        />
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
