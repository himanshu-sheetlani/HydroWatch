import React, { useState } from "react";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

const LoginForm = ({ onGoogleSignIn, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="card-right w-full md:w-7/12 p-8 md:p-14 lg:p-18 overflow-y-auto">
      <div className="max-w-sm mx-auto space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-zinc-500 text-sm">Please select an authentication method.</p>
        </div>

        <div className="space-y-6">
          <GoogleSignInButton onClick={onGoogleSignIn} loading={loading} />

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
              <span className="bg-[#0c0c0c] px-4 text-zinc-600">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/5 focus:border-cyan-500/50 outline-none transition-all text-white text-sm placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/5 focus:border-cyan-500/50 outline-none transition-all text-white text-sm placeholder:text-zinc-700 pr-12"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              onClick={() => alert("Standard sign-in is managed by your administrator.")}
            >
              Sign In
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
