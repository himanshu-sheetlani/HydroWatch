import React, { useState, useRef } from "react";

const NotificationsSection = () => {
  const [pushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialEmailEnabledRef = useRef(emailEnabled);
  const initialEmailInputRef = useRef(emailInput);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('Saving...');
    try {
      const payload = { email: emailEnabled ? emailInput : "" };
      const resp = await fetch('http://localhost:3000/api/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await resp.json();
      if (resp.ok) {
        setStatus('Saved');
        // update initial refs so changes are considered saved
        initialEmailEnabledRef.current = emailEnabled;
        initialEmailInputRef.current = emailInput;
      } else {
        setStatus(json.error || 'Save failed');
      }
    } catch (err) {
      setStatus('Network error');
      console.log(err)
    }
    setTimeout(() => setStatus(null), 2500);
    setIsSaving(false);
  };

  const dirty = (
    emailEnabled !== initialEmailEnabledRef.current ||
    emailInput !== initialEmailInputRef.current
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-4">
        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-2">Alert Preferences</h4>
        <div className="space-y-2">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Push Notifications</p>
              <p className="text-zinc-500 text-xs">Receive real-time alerts on your device.</p>
            </div>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${pushEnabled ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold">Email Alerts</p>
                <p className="text-zinc-500 text-xs">Get critical updates via email.</p>
              </div>
              <div
                role="button"
                tabIndex={0}
                aria-pressed={emailEnabled}
                onClick={() => setEmailEnabled(v => !v)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setEmailEnabled(v => !v);
                  }
                }}
                className={`w-10 h-5 rounded-full p-1 transition-colors ${emailEnabled ? 'bg-cyan-500' : 'bg-zinc-800'} ${emailEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="mt-3">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter emails, comma separated"
                disabled={!emailEnabled}
                aria-disabled={!emailEnabled}
                className={`w-full bg-white/5 border border-white/5 rounded px-3 py-2 text-sm text-white placeholder-zinc-500 ${!emailEnabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
              />

              <div className="mt-3 flex items-center gap-2">
                {dirty && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-3 py-1 rounded text-sm font-medium ${isSaving ? 'bg-zinc-700' : 'bg-cyan-500'}`}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                )}
                {status && <span className="text-sm text-zinc-300">{status}</span>}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">SMS Alerts</p>
              <p className="text-zinc-500 text-xs">Urgent system notifications via text message.</p>
            </div>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${smsEnabled ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
