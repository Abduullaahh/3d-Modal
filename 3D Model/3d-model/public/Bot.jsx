import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Bot(props) {
  const { nodes, materials } = useGLTF('/bot.gltf');
  const botRef = useRef();

  // State to track cursor position and scroll position
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

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

  // Update scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPos({
        x: window.scrollX / document.body.scrollWidth,  // Normalized horizontal scroll position
        y: window.scrollY / document.body.scrollHeight, // Normalized vertical scroll position
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Clamp rotation to a maximum angle
  const clampAngle = (angle, maxAngle) => {
    const maxRad = (maxAngle * Math.PI) / 180;
    return Math.max(-maxRad, Math.min(maxRad, angle));
  };

  useFrame(() => {
    if (botRef.current) {
      const botPosition = botRef.current.position;

      // Create a vector for the cursor direction
      const cursorVector = new THREE.Vector3(-cursorPos.x, -cursorPos.y, -1).normalize();

      // Adjust the movement factor
      const movementFactorX = cursorPos.x > -0.00000001 ? 0.3 : 1.5; // Reduce by half when moving right
      const movementFactorY = cursorPos.y > -0.00001 ? 0.2 : 1; // Reduce by half when moving top

      // Apply movement factors
      cursorVector.x *= movementFactorX;
      cursorVector.y *= movementFactorY;

      // Adjust for scroll position
      cursorVector.x += scrollPos.x;
      cursorVector.y += scrollPos.y;

      // Calculate the rotation matrix
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.lookAt(botPosition, cursorVector.add(botPosition), new THREE.Vector3(0, 1, 0));

      botRef.current.rotation.setFromRotationMatrix(rotationMatrix);
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
