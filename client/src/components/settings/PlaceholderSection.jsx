import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const PlaceholderSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="p-4 rounded-full bg-white/5 border border-white/10">
        <SettingsIcon className="text-zinc-500 w-8 h-8 animate-spin-slow" />
      </div>
      <div>
        <p className="text-white font-bold">Section Under Construction</p>
        <p className="text-zinc-500 text-sm">We're building more settings for your configuration.</p>
      </div>
    </div>
  );
};

export default PlaceholderSection;
