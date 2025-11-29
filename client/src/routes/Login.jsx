import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../stores/AuthProvider";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Sign-in failed", err);
      // Optionally show UI message
    }
  };

  // If already signed in, redirect
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded p-8">
        <h1 className="text-2xl font-semibold mb-4">Sign in to HydroWatch</h1>
        <p className="text-sm text-gray-600 mb-6">Sign in with your Google account to continue.</p>

        <button
          onClick={handleSignIn}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.4 0 6.1 1.4 7.9 2.6l5.8-5.7C34.1 3 29.4 1 24 1 14.7 1 6.9 6.9 3.4 14.9l6.8 5.3C12.6 15.1 17.6 9.5 24 9.5z" />
            <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.3-4.1H24v8.1h12.6c-.6 3-2.8 6.2-6.6 8.2l6.9 5.3C43.9 37.4 46.5 31.7 46.5 24.5z" />
            <path fill="#4A90E2" d="M10.9 29.9c-.8-2.3-1.3-4.8-1.3-7.4s.5-5.1 1.3-7.4L4 9.8C1.4 14 0 18.9 0 24s1.4 9.9 4 14.2l6.9-8.3z" />
            <path fill="#FBBC05" d="M24 46c6.4 0 11.1-2.1 14.8-5.7l-7.1-5.5c-2 1.4-4.6 2.4-7.7 2.4-6.4 0-11.7-4.8-13.6-11.3l-6.9 5.3C6.9 41.1 14.7 46 24 46z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
