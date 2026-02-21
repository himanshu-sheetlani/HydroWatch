import React from "react";

const AppBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#020202] pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 noise-bg opacity-[0.1] mix-blend-overlay"></div>
    </div>
  );
};

export default AppBackground;
