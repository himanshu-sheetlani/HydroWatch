import DataBox from "../components/DataBox.jsx";
import Navbar from "../components/Navbar.jsx";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
import AppBackground from "../components/shared/AppBackground";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Loader from "../components/shared/Loader";



function Dashboard() {
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
      const readingsRef = ref(db, "tank/readings");
      const unsubscribe = onValue(readingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          const arr = Object.values(raw);
          setData(arr);
          setReady(true);
        } else {
            setData([]);
        }
      });

      // Fallback: If no data arrives after 2 seconds, render the empty state
      const timeoutId = setTimeout(() => {
          setReady(true);
      }, 2000);

      return () => {
          unsubscribe();
          clearTimeout(timeoutId);
      };
    }, []);

    useGSAP(() => {
      if (!ready) return;

      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1 });
      }

      // Animate the Navbar
      gsap.fromTo(".nav-anim", 
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Staggered entrance for DataBox cards
      gsap.fromTo(".databox-anim", 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
      );
    }, { scope: containerRef, dependencies: [ready] });

    const latest = data.length > 0 ? data[data.length - 1] : null;

    const tdsData = useMemo(() => data.map((item, idx) => ({ time: idx, value: item.tds })), [data]);
    const tempData = useMemo(() => data.map((item, idx) => ({ time: idx, value: item.temperature })), [data]);
    const turbData = useMemo(() => data.map((item, idx) => ({ time: idx, value: item.turbidity })), [data]);
    const phData = useMemo(() => data.map((item, idx) => ({ time: idx, value: item.ph })), [data]);

    if (!ready) {
      return <Loader/>;
    }

  return (
    <div ref={containerRef} className="min-h-screen bg-transparent relative overflow-x-hidden opacity-0">
        <AppBackground />
        <div className="relative z-10">
            <div className="nav-anim">
              <Navbar/>
            </div>
            <div className="max-w-8xl mx-auto px-4 sm:px-10 lg:px-20 min-h-[calc(100vh-100px)] flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                    <div className="databox-anim">
                      <DataBox parameter={'TDS'} p1={300} p2={500} normal={'start'} value={latest ? latest.tds : 0} unit={'PPM'} max={1000} data={tdsData}/>
                    </div>
                    <div className="databox-anim">
                      <DataBox parameter={'Temperature'} p1={15} p2={35} normal={'mid'} value={latest ? latest.temperature : 0} unit={'°C'} max={50} data={tempData}/>
                    </div>
                    <div className="databox-anim">
                      <DataBox parameter={'Turbidity'} p1={3} p2={5} normal={'start'} value={latest ? latest.turbidity : 0} unit={'NTU'} max={10} data={turbData}/>
                    </div>
                    <div className="databox-anim">
                      <DataBox parameter={'pH'} p1={6.5} p2={8.5} normal={'mid'} value={latest ? latest.ph : 0} max={14} data={phData}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;