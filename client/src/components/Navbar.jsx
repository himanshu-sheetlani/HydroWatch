import React from "react";
import { BarChart2, Settings, LogOut } from "lucide-react"; 
import { useAuth } from "../stores/AuthProvider";
import Logo from "../assets/logo.png" ;

const Navbar = () => {
  return (
    <nav className="w-full bg-[#000] text-white flex items-center justify-between px-6 py-3 border-b border-gray-800 shadow-sm sticky top-0 z-50">

      <div className="flex items-center space-x-2">
        <a href="/" className="flex items-center">
            <img
              src={Logo}
              alt="HydroWatch Logo"
              className="h-10 w-auto"
            />
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/report">
          <button
            className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition"
            title="Reports"
          >
            <BarChart2 className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Reports</span>
          </button>
        </a>

        <a href="/setting">
          <button
            className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Settings</span>
          </button>
        </a>

        {/* Auth controls */}
        <AuthControls />
      </div>
    </nav>
  );
};

export default Navbar;

function AuthControls() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "user"}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="hidden sm:inline text-sm font-medium text-gray-200">{user.displayName}</span>
          <button
            onClick={() => signOut()}
            className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </>
      ) : (
        <button
          onClick={() => signInWithGoogle()}
          className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-500 text-sm"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
