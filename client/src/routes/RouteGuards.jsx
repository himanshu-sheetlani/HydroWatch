import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../stores/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If user is already signed in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// OnboardGuard and OnboardingRoute are simple pass-throughs for now.
// They can be extended with onboarding logic later.
const OnboardGuard = ({ children }) => {
  return children;
};

const OnboardingRoute = ({ children }) => {
  return children;
};

export { ProtectedRoute, PublicRoute, OnboardGuard, OnboardingRoute };
