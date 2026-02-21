import React from "react";
import { Activity } from "lucide-react";
import logoImage from "../../assets/logo.png";

const AuthBrandingPane = () => {
  return (
    <div className="card-left hidden md:flex w-full md:w-5/12 p-8 md:p-14 flex-col justify-center space-y-8 bg-gradient-to-br from-cyan-500/10 to-transparent border-r border-white/5">
      <div className="space-y-6">
        <div className="p-3 w-fit rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
          <img src={logoImage} alt="HydroWatch" className="h-10 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            The Pulse of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Water Intelligence
            </span>
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Empowering the world with real-time insights and proactive management for its most vital resource.
          </p>
        </div>

        <div className="flex items-center gap-4 text-zinc-500 pt-4">
          <Activity className="text-cyan-400 w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">Network Synchronized</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandingPane;
