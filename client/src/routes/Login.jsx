import React, { Suspense, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Eye, EyeOff, Lock, ShieldCheck, ChevronRight, Activity } from "lucide-react";
import logoImage from "../assets/logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../stores/AuthProvider";

// Branded Components
import BackgroundParticles from "../components/landing/BackgroundParticles";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const container = useRef();
  const cardRef = useRef();
  const from = location.state?.from?.pathname || "/";
  
  // local UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(cardRef.current, { 
      scale: 0.9, 
      opacity: 0, 
      duration: 1.2, 
      ease: "power4.out" 
    })
    .from(".card-left > *", { 
      x: -20, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.1, 
      ease: "power3.out" 
    }, "-=0.6")
    .from(".card-right > *", { 
      x: 20, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.1, 
      ease: "power3.out" 
    }, "-=0.8");
  }, { scope: container });

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Sign-in failed", err);
      setError(err?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div ref={container} className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans p-4 md:p-6">
      
      {/* Background Layer: Abstract Tech Theme */}
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

      {/* CENTERED GLASS CARD */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-5xl md:h-[650px] flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_32px_128px_-32px_rgba(0,0,0,0.8)]"
      >
        {/* Left Pane (Branding) - Hidden on Mobile */}
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

        {/* Right Pane (Form) */}
        <div className="card-right w-full md:w-7/12 p-8 md:p-14 lg:p-18 overflow-y-auto">
          <div className="max-w-sm mx-auto space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-zinc-500 text-sm">Please select an authentication method.</p>
            </div>

            <div className="space-y-6">
              {/* GOOGLE ON TOP */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className={`w-full py-4 bg-white/[0.05] border border-white/10 rounded-2xl font-bold text-white flex items-center justify-center gap-3 hover:bg-white/[0.08] transition-all active:scale-[0.98] ${loading ? 'opacity-70' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                  <path fill="#EA4335" d="M24 9.5c3.4 0 6.1 1.4 7.9 2.6l5.8-5.7C34.1 3 29.4 1 24 1 14.7 1 6.9 6.9 3.4 14.9l6.8 5.3C12.6 15.1 17.6 9.5 24 9.5z" />
                  <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.3-4.1H24v8.1h12.6c-.6 3-2.8 6.2-6.6 8.2l6.9 5.3C43.9 37.4 46.5 31.7 46.5 24.5z" />
                  <path fill="#4A90E2" d="M10.9 29.9c-.8-2.3-1.3-4.8-1.3-7.4s.5-5.1 1.3-7.4L4 9.8C1.4 14 0 18.9 0 24s1.4 9.9 4 14.2l6.9-8.3z" />
                  <path fill="#FBBC05" d="M24 46c6.4 0 11.1-2.1 14.8-5.7l-7.1-5.5c-2 1.4-4.6 2.4-7.7 2.4-6.4 0-11.7-4.8-13.6-11.3l-6.9 5.3C6.9 41.1 14.7 46 24 46z" />
                </svg>
                {loading ? "Authenticating..." : "Continue with Google"}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black"><span className="bg-[#0c0c0c] px-4 text-zinc-600">OR</span></div>
              </div>

              {/* Standard Login */}
              <div className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/5 focus:border-cyan-500/50 outline-none transition-all text-white text-sm placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">Password</label>
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
      </div>
    </div>
  );
};

export default Login;
