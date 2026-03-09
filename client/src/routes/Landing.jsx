import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ChevronRight,
  Droplets,
  Shield,
  Activity,
  Database,
  Wind,
  Zap,
  Mail,
  Lock,
  Archive,
  Trash2,
  Cloud,
  Server,
} from "lucide-react";
import logoImage from "../assets/logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Extracted Components
import BackgroundParticles from "../components/landing/BackgroundParticles";
import WaterScene from "../components/landing/WaterScene";
import DashboardPreview from "../components/landing/DashboardPreview";
import {
  AnimatedStyles,
  MonitoringIcon,
  ThresholdIcon,
  AlertIcon,
  PipelineIcon,
  AuthIcon,
  ArchiveIcon,
  CleanupIcon,
  CloudIcon,
} from "../components/landing/AnimatedFeatureIcons";

gsap.registerPlugin(ScrollTrigger);

export default function HydroWatchLanding() {
  const container = useRef();

  useGSAP(
    () => {
      // Hero Reveal Sequence
      const tl = gsap.timeline();
      tl.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }).from(
        ".hero-3d",
        {
          x: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.8",
      );

      // Continuous floating animation for the 3D scene
      gsap.to(".hero-3d", {
        y: 15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Features Section Animations
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 85%", // Trigger earlier
          toggleActions: "play none none none",
          // markers: true, // Uncomment for debugging
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all", // Ensure props are cleared after animation
      });

      // Features Hover Interaction
      const cards = gsap.utils.toArray(".feature-card");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -12,
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderColor: "rgba(34, 211, 238, 0.4)",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 211, 238, 0.1)",
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(".feature-icon-container"), {
            scale: 1.2,
            backgroundColor: "rgba(34, 211, 238, 0.1)",
            duration: 0.4,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "none",
            duration: 0.4,
            ease: "power2.inOut",
          });
          gsap.to(card.querySelector(".feature-icon-container"), {
            scale: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            duration: 0.4,
          });
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-black text-white selection:bg-white/20 font-sans selection:text-white relative overflow-hidden"
    >
      <AnimatedStyles />
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Navbar Integration */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-12 py-4 md:py-5 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-105 duration-300">
          <img
            src={logoImage}
            alt="HydroWatch"
            className="h-10 md:h-12 object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          />
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-400 font-medium">
          <a
            href="#features"
            className="hidden sm:block hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="/login"
            className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
          >
            Sign In
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
        {/* Animated Background Glows */}
        <div
          className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-full max-w-lg h-96 bg-blue-600/10 blur-[130px] rounded-full opacity-40 pointer-events-none animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-20">
          {/* Content (Ordered second on mobile to be below 3D if needed, but headlines usually go first) */}
          {/* Swapping: Putting Text first for Mobile (Default order) */}
          <div className="hero-content text-center md:text-left space-y-6 md:space-y-8 order-last md:order-first">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
              Data for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-sm">
                Purer Water
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
              Real-time monitoring and intelligent analytics for smart water
              management. Built for reliability, transparency, and efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-center justify-center md:justify-start">
              <a href="/login" className="w-full sm:w-auto">
                <button className="btn-primary btn-shine w-full sm:w-auto">
                  Get Started
                </button>
              </a>
              <a
                href="https://ijaitr.in/files/V3I1/21.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-shine group gap-2 w-full sm:w-auto text-sm"
              >
                Research Paper
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right 3D Effect (Ordered first on mobile) */}
          <div className="hero-3d relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] w-full cursor-grab active:cursor-grabbing order-first md:order-last">
            {/* Inner Glow Behind Image */}
            <div className="absolute inset-10 bg-cyan-400/5 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>

            <Canvas
              camera={{ position: [0, 0, 5], fov: 40 }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={2} />
              <pointLight
                position={[-5, -5, 5]}
                intensity={0.5}
                color="#00ffff"
              />
              <Suspense fallback={null}>
                <BackgroundParticles />
                <WaterScene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>

      <DashboardPreview />

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="section-header text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Integrate in minutes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A simple, powerful interface designed to scale from small tanks to
            industrial facilities.
          </p>
        </div>

        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Real-Time Sensor Monitoring",
              desc: "Live tracking of pH, TDS, turbidity, and temperature with near real-time updates.",
              icon: MonitoringIcon,
            },
            {
              title: "Automated Threshold Detection",
              desc: "Built-in logic to detect unsafe water conditions instantly.",
              icon: ThresholdIcon,
            },
            {
              title: "Instant Email Alerts",
              desc: "Styled alert notifications sent automatically when limits are breached.",
              icon: AlertIcon,
            },
            {
              title: "Secure IoT Data Pipeline",
              desc: "ESP32 → Authenticated API → Backend validation → Firebase storage.",
              icon: PipelineIcon,
            },
            {
              title: "Google Auth + RBAC",
              desc: "Only authorized users can access dashboard data with secure signing.",
              icon: AuthIcon,
            },
            {
              title: "Daily Snapshot Archiving",
              desc: "Automatic daily summaries for long-term tracking and analysis.",
              icon: ArchiveIcon,
            },
            {
              title: "Automated Data Cleanup",
              desc: "Old real-time entries removed to maintain database performance.",
              icon: CleanupIcon,
            },
            {
              title: "Scalable Cloud Deployment",
              desc: "24×7 backend with cron automation and uptime monitoring.",
              icon: CloudIcon,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card p-8 rounded-3xl bg-white/[0.02] border border-white/5 transition-colors cursor-default group flex flex-col items-center text-center"
            >
              <div className="feature-icon-container w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-transform duration-500">
                <feature.icon />
              </div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section-header py-24 md:py-32 bg-black flex flex-col items-center text-center px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-8 md:space-y-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Ready to optimize?
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Join the labs using HydroWatch to automate their water intelligence
            systems. Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full sm:w-auto">
            <a href="/login" className="w-full sm:w-auto">
              <button className="btn-primary btn-shine w-full sm:w-auto">
                Get Started Now
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
        © {new Date().getFullYear()} HydroWatch — Built for the future of water.
      </footer>
    </div>
  );
}
