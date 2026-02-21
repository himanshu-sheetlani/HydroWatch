import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, LogOut } from "lucide-react";
import logoImage from "../../assets/logo.png";

const SettingsSidebar = ({ tabs, activeTab, setActiveTab, onSignOut }) => {
  return (
    <div className="w-full md:w-64 space-y-8">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/dashboard" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
          <ChevronLeft size={20} />
        </Link>
        <img src={logoImage} alt="HydroWatch" className="h-6" />
      </div>

      <div className="space-y-2">
        <h2 className="text-white text-2xl font-bold tracking-tight mb-6 px-2">Settings</h2>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                  : "hover:bg-white/5 text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-8 border-t border-white/5 mt-auto">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsSidebar;
