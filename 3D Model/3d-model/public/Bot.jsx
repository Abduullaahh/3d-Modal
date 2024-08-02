import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function Bot(props) {
  const { nodes, materials } = useGLTF('/bot.gltf');
  const botRef = useRef();

  // State to track cursor position
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Update cursor position on mouse move
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1; // Normalized cursor position X
      const y = -(clientY / window.innerHeight) * 2 + 1; // Normalized cursor position Y
      setCursorPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Clamp rotation to a maximum angle
  const clampAngle = (angle, maxAngle) => {
    const maxRad = (maxAngle * Math.PI) / 180;
    return Math.max(-maxRad, Math.min(maxRad, angle));
  };

  // Rotate bot to face cursor with angle limit
  useFrame(() => {
    if (botRef.current) {
      const z = 1; // Assuming the bot faces the positive Z direction

      // Calculate angles for X and Y rotations
      const xAngle = Math.atan2(cursorPos.y, z);
      const yAngle = Math.atan2(-cursorPos.x, z);

      // Clamp angles to a maximum of 60 degrees
      botRef.current.rotation.x = clampAngle(-xAngle, 120);
      botRef.current.rotation.y = clampAngle(-yAngle, 60);
    }
  });

  return (
    <group {...props} ref={botRef} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.717}>
        <mesh geometry={nodes.Sphere_0.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Sphere_1.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Sphere_2.geometry} material={materials['Material.003']} />
      </group>
    </group>
  );
}

useGLTF.preload('/bot.gltf');
