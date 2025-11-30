import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../stores/AuthProvider";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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

  // If already signed in, redirect
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10 w-full max-w-4xl mx-4 flex items-center gap-10">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600/10 to-cyan-500/6 rounded-xl p-8 items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl text-white font-bold mb-3">Welcome back</h2>
            <p className="text-sm text-zinc-300 max-w-xs">Monitor your water quality, view AI-generated insights, and get alerts when thresholds are crossed.</p>
            <img src="/assets/water-illustration.svg" alt="water" className="mt-6 w-56 mx-auto opacity-90" />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-zinc-800/60 backdrop-blur border border-zinc-700 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500 text-zinc-900 rounded-full p-2">HW</div>
            <div>
              <h1 className="text-xl font-semibold text-white">Sign in to HydroWatch</h1>
              <div className="text-xs text-zinc-400">Sign in with your Google account to continue</div>
            </div>
          </div>

          {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

          <button
            onClick={handleSignIn}
            disabled={loading}
            aria-busy={loading}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-transform transform ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105'} bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.4 0 6.1 1.4 7.9 2.6l5.8-5.7C34.1 3 29.4 1 24 1 14.7 1 6.9 6.9 3.4 14.9l6.8 5.3C12.6 15.1 17.6 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.3-4.1H24v8.1h12.6c-.6 3-2.8 6.2-6.6 8.2l6.9 5.3C43.9 37.4 46.5 31.7 46.5 24.5z" />
              <path fill="#4A90E2" d="M10.9 29.9c-.8-2.3-1.3-4.8-1.3-7.4s.5-5.1 1.3-7.4L4 9.8C1.4 14 0 18.9 0 24s1.4 9.9 4 14.2l6.9-8.3z" />
              <path fill="#FBBC05" d="M24 46c6.4 0 11.1-2.1 14.8-5.7l-7.1-5.5c-2 1.4-4.6 2.4-7.7 2.4-6.4 0-11.7-4.8-13.6-11.3l-6.9 5.3C6.9 41.1 14.7 46 24 46z" />
            </svg>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                <span>Signing in…</span>
              </>
            ) : (
              'Sign in with Google'
            )}
          </button>

          <div className="mt-4 text-center text-xs text-zinc-500">
            <button className="underline" onClick={() => alert('Email sign-in not implemented yet')}>Sign in with email</button>
          </div>

          <div className="mt-6 text-xs text-zinc-500">By signing in you agree to our <button className="underline">Terms</button> and <button className="underline">Privacy Policy</button>.</div>
        </div>
      </div>

      <style>{`
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes blob { 0% { transform: translateY(0) scale(1); } 33% { transform: translateY(-10px) scale(1.05); } 66% { transform: translateY(8px) scale(0.95); } 100% { transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};

export default Login;
