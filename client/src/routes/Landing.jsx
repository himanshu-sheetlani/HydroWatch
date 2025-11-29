import React, { useEffect, useRef, useState } from 'react';

function useInView(ref, options = {}) {
	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const obs = new IntersectionObserver(
			(entries) => entries.forEach(e => {
				if (e.isIntersecting) node.classList.add('in-view');
				else if (options.once !== true) node.classList.remove('in-view');
			}),
			{ threshold: 0.15 }
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, [ref, options.once]);
}

const Chip = ({ icon, label }) => (
	<div className="hw-chip" aria-hidden="true">
		<div className="hw-chip-ico">{icon}</div>
		<div className="hw-chip-label">{label}</div>
	</div>
);

export default function Landing() {
	const heroRef = useRef();
	const featuresRef = useRef();
	const aboutRef = useRef();
	useInView(heroRef, { once: false });
	useInView(featuresRef, { once: false });
	useInView(aboutRef, { once: false });

	const [data, setData] = useState({ ph: 7.2, tds: 320, turbidity: 4.1, temp: 22.8 });
	useEffect(() => {
		// Demo live updates: gently vary values
		const id = setInterval(() => {
			setData(prev => ({
				ph: +(prev.ph + (Math.random() - 0.48) * 0.02).toFixed(2),
				tds: Math.max(50, Math.round(prev.tds + (Math.random() - 0.45) * 8)),
				turbidity: +(Math.max(0.2, prev.turbidity + (Math.random() - 0.5) * 0.15)).toFixed(2),
				temp: +(prev.temp + (Math.random() - 0.5) * 0.12).toFixed(2),
			}));
		}, 1100);
		return () => clearInterval(id);
	}, []);

	// Simple particle field for ambient background
	useEffect(() => {
		const canvas = document.getElementById('hw-particles');
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		let w = canvas.width = canvas.clientWidth;
		let h = canvas.height = canvas.clientHeight;
		const particles = Array.from({ length: Math.round((w * h) / 60000) }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			r: 0.8 + Math.random() * 2.2,
			dx: (Math.random() - 0.5) * 0.3,
			dy: (Math.random() - 0.5) * 0.3,
			hue: 170 + Math.random() * 40
		}));

		let raf = null;
		const loop = () => {
			ctx.clearRect(0, 0, w, h);
			particles.forEach(p => {
				p.x += p.dx; p.y += p.dy;
				if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
				if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
				ctx.beginPath();
				const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
				grad.addColorStop(0, `hsla(${p.hue},90%,60%,0.18)`);
				grad.addColorStop(1, `hsla(${p.hue},80%,45%,0)`);
				ctx.fillStyle = grad;
				ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
				ctx.fill();
			});
			raf = requestAnimationFrame(loop);
		};
		loop();
		const onResize = () => { w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight; };
		window.addEventListener('resize', onResize);
		return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
	}, []);

	// small parallax for bubbles
	useEffect(() => {
		const onMove = (e) => {
			document.documentElement.style.setProperty('--mx', (e.clientX - window.innerWidth/2) / 100 + 'px');
			document.documentElement.style.setProperty('--my', (e.clientY - window.innerHeight/2) / 120 + 'px');
		};
		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	}, []);

	return (
		<main className="min-h-screen text-cyan-100 bg-gradient-to-b from-[#020205] to-[#041018] font-sans relative overflow-x-hidden">
			<canvas id="hw-particles" className="fixed inset-0 z-0 pointer-events-none opacity-90" aria-hidden="true"></canvas>

			<section ref={heroRef} className="relative z-20 w-screen -ml-[50vw] left-1/2 -mr-[50vw] right-1/2 py-24">
				<div className="max-w-[1400px] mx-auto flex items-center gap-12 px-6">
					<div className="flex-1">
						<h1 className="text-[4.25rem] leading-[0.9] text-transparent -webkit-text-stroke-[0.6px]" style={{ WebkitTextStrokeColor: 'rgba(107,255,234,0.95)' }}>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#04d9ff] to-[#6bffea] animate-[liquid_6s_ease-in-out_infinite]">HydroWatch</span>
						</h1>
						<p className="text-cyan-200 mt-3 text-lg">Real-time water intelligence powered by IoT + Firebase</p>

						<div className="flex gap-4 mt-6">
							<a href="/login"><button className="px-5 py-3 rounded-[12px] font-semibold bg-gradient-to-r from-[#04d9ff] to-[#6bffea] text-[#002428] shadow-lg">Get Started</button></a>
							<button className="px-5 py-3 rounded-[12px] font-semibold text-[#6bffea] border border-[rgba(107,255,234,0.08)]">Monitor Quality</button>
						</div>

						<div className="flex flex-wrap gap-3 mt-6">
							<Chip icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C8 7 5 9 5 13c0 4 3 6 7 8s7-4 7-8c0-4-3-6-7-10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Sensors" />
							<Chip icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 13l3-3 3 3 4-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Realtime" />
							<Chip icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Alerts" />
						</div>
					</div>

					<div className="w-96 flex justify-center">
						<div className="w-[220px] h-[280px] rounded-[18px] bg-[rgba(255,255,255,0.02)] shadow-[0_30px_80px_rgba(3,30,40,0.55)] border border-[rgba(107,255,234,0.06)] relative overflow-hidden">
							<div className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-[rgba(4,217,255,0.18)] to-[rgba(107,255,234,0.12)] shadow-inner" style={{ height: (50 + (data.ph - 7) * 4) + '%' }} />
							<div className="absolute inset-3 pointer-events-none">
								<div className="absolute left-[10%] top-[20%] rounded-full px-2 py-1 text-sm font-bold text-cyan-100 bg-[rgba(255,255,255,0.02)]">Sensors</div>
								<div className="absolute right-[8%] top-[40%] rounded-full px-2 py-1 text-sm font-bold text-cyan-100 bg-[rgba(255,255,255,0.02)]">Cloud</div>
								<div className="absolute left-[40%] bottom-[18%] rounded-full px-2 py-1 text-sm font-bold text-cyan-100 bg-[rgba(255,255,255,0.02)]">Edge</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section ref={featuresRef} className="py-14 px-6">
				<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<article className="rounded-lg p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.02))] border border-[rgba(107,255,234,0.03)] shadow-lg">
						<div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-[linear-gradient(135deg,rgba(4,217,255,0.12),rgba(107,255,234,0.06))]">🔮</div>
						<h3 className="mt-4 text-white">Smart Sensors</h3>
						<p className="mt-2 text-cyan-200">Holographic sensor nodes detect pH, TDS, turbidity and temperature in realtime.</p>
					</article>
					<article className="rounded-lg p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.02))] border border-[rgba(107,255,234,0.03)] shadow-lg">
						<div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-[linear-gradient(135deg,rgba(4,217,255,0.12),rgba(107,255,234,0.06))]">📈</div>
						<h3 className="mt-4 text-white">Analytics</h3>
						<p className="mt-2 text-cyan-200">AI-ready time-series insights and anomaly detection with historical playback.</p>
					</article>
					<article className="rounded-lg p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.02))] border border-[rgba(107,255,234,0.03)] shadow-lg">
						<div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-[linear-gradient(135deg,rgba(4,217,255,0.12),rgba(107,255,234,0.06))]">⚠️</div>
						<h3 className="mt-4 text-white">Alerts & Rules</h3>
						<p className="mt-2 text-cyan-200">Instant notifications and programmable thresholds to protect water assets.</p>
					</article>
					<article className="rounded-lg p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.02))] border border-[rgba(107,255,234,0.03)] shadow-lg">
						<div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-[linear-gradient(135deg,rgba(4,217,255,0.12),rgba(107,255,234,0.06))]">☁️</div>
						<h3 className="mt-4 text-white">Cloud Sync</h3>
						<p className="mt-2 text-cyan-200">Secure Firebase-backed storage for scalable device fleet management.</p>
					</article>
				</div>
			</section>

			<section ref={aboutRef} className="py-12 px-6">
				<div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
					<div className="flex-1">
						<svg viewBox="0 0 600 360" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
							<defs>
								<linearGradient id="g0" x1="0" x2="1"><stop offset="0" stopColor="#04d9ff" stopOpacity="0.9"/><stop offset="1" stopColor="#6bffea" stopOpacity="0.4"/></linearGradient>
							</defs>
							<g transform="translate(40,30)">
								<rect x="0" y="0" width="220" height="120" rx="12" fill="rgba(255,255,255,0.04)" stroke="url(#g0)" />
								<circle cx="40" cy="40" r="10" fill="#04d9ff" />
								<rect x="120" y="20" width="70" height="70" rx="8" fill="rgba(255,255,255,0.02)" stroke="#0ff" />
								<path d="M220 60 L320 60 L360 100" stroke="#6bffea" strokeWidth="2" fill="none" strokeOpacity="0.6" />
								<rect x="320" y="90" width="180" height="80" rx="12" fill="rgba(255,255,255,0.03)" stroke="#3ef" />
							</g>
						</svg>
					</div>

					<div className="flex-1 text-cyan-100">
						<h2 className="text-white text-2xl">How the system works</h2>
						<p className="mt-3 text-cyan-200">HydroWatch combines distributed IoT sensors, secure Firebase sync, and cloud analytics to provide continuous, actionable water intelligence. Our modular sensors stream live telemetry while the dashboard visualizes trends, issues alerts, and empowers teams to respond faster.</p>
						<ul className="mt-4 list-disc list-inside text-cyan-200">
							<li>Edge data aggregation with low-power microcontrollers</li>
							<li>Encrypted sync to Firebase real-time & Firestore</li>
							<li>Streamed analytics and anomaly detection</li>
						</ul>
					</div>
				</div>
			</section>

			<footer className="border-t border-[rgba(107,255,234,0.06)] py-4 text-center text-cyan-200">© 2025 HydroWatch — IoT. Intelligence. Insight.</footer>
		</main>
	);
}
