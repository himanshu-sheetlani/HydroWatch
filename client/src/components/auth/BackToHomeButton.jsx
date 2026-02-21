import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackToHomeButton = ({ to = "/", label = "Back to Home", className = "" }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-white/10 transition-all group w-fit ${className}`}
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </Link>
  );
};

export default BackToHomeButton;
