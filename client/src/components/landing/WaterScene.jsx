import React, { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import waterImage from "../../assets/water.png";

export default function WaterScene() {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, waterImage);
  const { mouse } = useThree();

  useFrame((state) => {
    // Interactive Tilt toward mouse
    const targetRotationX = -mouse.y * 0.3;
    const targetRotationY = mouse.x * 0.3;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);
  });

  return (
    <group>
      {/* Rim light to make the image pop */}
      <spotLight position={[0, 0, 5]} intensity={2} distance={10} angle={0.5} penumbra={1} />
      <mesh ref={meshRef} scale={[2, 2.6, 1.5]}>
        <planeGeometry args={[1.6, 1.2, 32, 32]} />
        <meshStandardMaterial 
          map={texture} 
          transparent={true} 
          alphaTest={0.05}
          metalness={0.2} 
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
