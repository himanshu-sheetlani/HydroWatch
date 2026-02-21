import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Monitor, 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../stores/AuthProvider";

// Extracted Components
import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSection from "../components/settings/AccountSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import PlaceholderSection from "../components/settings/PlaceholderSection";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Failed to sign out", err);
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Monitor },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection user={user} />;
      case "notifications":
        return <NotificationsSection />;
      default:
        return <PlaceholderSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          <SettingsSidebar 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onSignOut={handleSignOut} 
          />

          {/* RIGHT: CONTENT AREA */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-10">
              <h2 className="text-white text-3xl font-bold tracking-tight mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-zinc-500 text-sm">Manage your core account information and preferences.</p>
            </div>

            {renderContent()}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Settings;
