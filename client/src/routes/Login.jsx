import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../stores/AuthProvider";

// Extracted Components
import BackToHomeButton from "../components/auth/BackToHomeButton";
import AuthBackground from "../components/auth/AuthBackground";
import AuthBrandingPane from "../components/auth/AuthBrandingPane";
import LoginForm from "../components/auth/LoginForm";

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
      <BackToHomeButton />
      <AuthBackground />

      {/* CENTERED GLASS CARD */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-5xl md:h-[650px] flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_32px_128px_-32px_rgba(0,0,0,0.8)]"
      >
        <AuthBrandingPane />
        <LoginForm 
          onGoogleSignIn={handleSignIn} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Login;
