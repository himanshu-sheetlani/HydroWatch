import React from "react";

const AccountSection = ({ user }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0] || 'U'}
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-lg">{user?.displayName || 'User'}</h3>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
          <button className="ml-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all">
            Sync Account
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-2">Profile Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Display Name", value: user?.displayName || 'N/A' },
            { label: "Email Address", value: user?.email || 'N/A' },
            { label: "Provider", value: "Google Authentication" },
            { label: "Last Session", value: new Date().toLocaleDateString() },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-tight mb-1">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
