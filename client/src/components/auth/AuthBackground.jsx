import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import BackgroundParticles from "../landing/BackgroundParticles";

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020202]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 noise-bg opacity-[0.15] mix-blend-overlay"></div>
      
      {/* Abstract Particle Field */}
      <div className="absolute inset-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
          <Suspense fallback={null}>
            <BackgroundParticles count={300} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default AuthBackground;
