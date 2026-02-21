import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackToHomeButton = () => {
  return (
    <Link 
      to="/" 
      className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-white/10 transition-all group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
    </Link>
  );
};

export default BackToHomeButton;
