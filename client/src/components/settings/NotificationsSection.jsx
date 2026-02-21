import React from "react";

const NotificationsSection = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-4">
        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-2">Alert Preferences</h4>
        <div className="space-y-2">
          {[
            { title: "Push Notifications", desc: "Receive real-time alerts on your device.", enabled: true },
            { title: "Email Alerts", desc: "Get detailed reports and critical updates via email.", enabled: true },
            { title: "SMS Alerts", desc: "Urgent system notifications via text message.", enabled: false },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold">{item.title}</p>
                <p className="text-zinc-500 text-xs">{item.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${item.enabled ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
