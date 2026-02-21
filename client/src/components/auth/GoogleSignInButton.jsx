import React from "react";

const GoogleSignInButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
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
  );
};

export default GoogleSignInButton;
