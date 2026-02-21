import React from 'react';
import './Loader.css';

const Loader = ({ message = "loading..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-zinc-900/50">
        {/* Waves */}
        <div className="water-container">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>

        {/* Bubbles */}
        <div className="bubbles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`bubble bubble-${i + 1}`}></div>
          ))}
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-12 text-center">
        <h2 className="text-sm font-black text-cyan-500 uppercase tracking-[0.4em] animate-pulse">
          {message}
        </h2>
        <div className="mt-4 flex gap-1 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
