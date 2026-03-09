import React from "react";
import {
  Activity,
  Zap,
  Mail,
  Database,
  Shield,
  Archive,
  Trash2,
  Cloud,
} from "lucide-react";

const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.15); }
    28% { transform: scale(1); }
    42% { transform: scale(1.15); }
    70% { transform: scale(1); }
  }
  @keyframes spin-slow {
    100% { transform: rotate(360deg); }
  }
  @keyframes dash {
    to { stroke-dashoffset: -20; }
  }
  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg); }
    75% { transform: rotate(8deg); }
  }
  @keyframes drop {
    0% { transform: translateY(-6px); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(8px); opacity: 0; }
  }
  @keyframes slide-up {
    0% { transform: translateY(8px); opacity: 0; }
    50% { transform: translateY(0px); opacity: 1; }
    100% { transform: translateY(-8px); opacity: 0; }
  }
  @keyframes data-flow {
    0% { transform: translateY(100%); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
`;

export const AnimatedStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: styles }} />
);

export const MonitoringIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <div
      className="absolute inset-0 rounded-full border border-cyan-400/30"
      style={{
        animation: "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
      }}
    ></div>
    <div
      className="absolute inset-0 rounded-full border border-cyan-400/20"
      style={{
        animation:
          "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 1s",
      }}
    ></div>
    <div style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}>
      <Activity className="w-6 h-6 text-cyan-400 relative z-10" />
    </div>
  </div>
);

export const ThresholdIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <div
      className="absolute inset-2 bg-yellow-400/20 blur-md rounded-full"
      style={{ animation: "pulse-ring 1s infinite" }}
    ></div>
    <div style={{ animation: "shake 0.5s infinite" }}>
      <Zap className="w-6 h-6 text-yellow-400 relative z-10" />
    </div>
  </div>
);

export const AlertIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
    <div style={{ animation: "float 3s ease-in-out infinite" }}>
      <Mail className="w-6 h-6 text-cyan-400 relative z-10" />
    </div>
    <div
      className="absolute w-3 h-2 bg-cyan-400/50 rounded-sm"
      style={{ animation: "slide-up 2s ease-in-out infinite", zIndex: 0 }}
    ></div>
    <div
      className="absolute w-2 h-1.5 bg-cyan-400/30 rounded-sm"
      style={{ animation: "slide-up 2s ease-in-out infinite 0.5s", zIndex: 0 }}
    ></div>
  </div>
);

export const PipelineIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
    <div style={{ animation: "float 2.5s ease-in-out infinite" }}>
      <Database className="w-6 h-6 text-indigo-400 relative z-10" />
    </div>
    <div
      className="absolute bottom-0 w-0.5 h-full bg-indigo-400/40"
      style={{ animation: "data-flow 1.5s linear infinite" }}
    ></div>
    <div
      className="absolute bottom-0 left-4 w-0.5 h-full bg-indigo-400/40"
      style={{ animation: "data-flow 1.5s linear infinite 0.4s" }}
    ></div>
    <div
      className="absolute bottom-0 right-4 w-0.5 h-full bg-indigo-400/40"
      style={{ animation: "data-flow 1.5s linear infinite 0.8s" }}
    ></div>
  </div>
);

export const AuthIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group overflow-hidden">
    <Shield className="w-6 h-6 text-emerald-400 relative z-10 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-8 h-1 bg-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,1)]"
        style={{ animation: "scanline 2s linear infinite" }}
      ></div>
    </div>
  </div>
);

export const ArchiveIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
    <div style={{ animation: "float 2.5s ease-in-out infinite" }}>
      <Archive className="w-6 h-6 text-purple-400 relative z-10" />
    </div>
    <div
      className="absolute top-1 w-2 h-3 bg-purple-400/50 rounded-sm shadow-[0_0_4px_rgba(192,132,252,0.8)]"
      style={{ animation: "drop 2s infinite" }}
    ></div>
  </div>
);

export const CleanupIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <div style={{ animation: "shake 2s infinite" }}>
      <Trash2 className="w-6 h-6 text-red-400 relative z-10" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute -top-1 w-1.5 h-1.5 bg-red-400/60 rounded-sm"
        style={{ animation: "drop 1.5s infinite" }}
      ></div>
      <div
        className="absolute top-0 w-1 h-1 bg-red-400/60 rounded-sm"
        style={{ animation: "drop 1.5s infinite 0.3s" }}
      ></div>
    </div>
  </div>
);

export const CloudIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
    <div style={{ animation: "float 3s ease-in-out infinite" }}>
      <Cloud className="w-6 h-6 text-blue-400 relative z-10" />
    </div>
    <div className="absolute w-full h-full inset-0">
      <div
        className="absolute bottom-1 left-3.5 w-1 h-1.5 bg-blue-400/80 rounded-full"
        style={{ animation: "drop 1.5s infinite 0.1s" }}
      ></div>
      <div
        className="absolute bottom-1 auto left-6 w-1 h-1.5 bg-blue-400/80 rounded-full"
        style={{ animation: "drop 1.5s infinite 0.4s" }}
      ></div>
      <div
        className="absolute bottom-1 right-3.5 w-1 h-1.5 bg-blue-400/80 rounded-full"
        style={{ animation: "drop 1.5s infinite 0.7s" }}
      ></div>
    </div>
  </div>
);
