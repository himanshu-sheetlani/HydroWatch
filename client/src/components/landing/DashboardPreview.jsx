import React, { useRef } from "react";
import dashboard from "../../assets/dashboard.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPreview() {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".dashboard-container", {
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        toggleActions: "play none none none"
      },
      y: 100,
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: "power3.out"
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-16 md:py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="section-header text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight">Intelligence in real-time</h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            A high-performance interface designed for precision telemetry and rapid response.
          </p>
        </div>

        <div className="dashboard-container relative group">
          {/* Glassmorphic Container with Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl md:rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative bg-black/4 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Dashboard Header */}
            <div className="px-4 py-4 md:px-8 md:py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]"></div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Live Telemetry Analysis</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
              </div>
            </div>

            {/* Dashboard Body */}
            <img src={dashboard} alt="dashboard" />
          </div>
        </div>
      </div>
    </section>
  );
}
