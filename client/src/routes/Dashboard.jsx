import DataBox from "../components/DataBox.jsx";
import Navbar from "../components/Navbar.jsx";
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";



function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
      const readingsRef = ref(db, "tank/readings");
      onValue(readingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          const arr = Object.values(raw);
          setData(arr);
        }
      });
    }, []);

    const latest = data.length > 0 ? data[data.length - 1] : null;

    const tdsData = data.map((item, idx) => ({ time: idx, value: item.tds }));
    const tempData = data.map((item, idx) => ({ time: idx, value: item.temperature }));
    const turbData = data.map((item, idx) => ({ time: idx, value: item.turbidity }));
    const phData = data.map((item, idx) => ({ time: idx, value: item.ph }));

  return (
    <div className="bg-zinc-950">
        <Navbar/>
        <div className="flex justify-center flex-wrap p-10">
            <DataBox parameter={'TDS'} p1={300} p2={500} normal={'start'} value={latest ? latest.tds : 0} unit={'PPM'} max={1000} data={tdsData}/>
            <DataBox parameter={'Temperature'} p1={15} p2={35} normal={'mid'} value={latest ? latest.temperature : 0} unit={'°C'} max={50} data={tempData}/>
            <DataBox parameter={'Turbidity'} p1={3} p2={5} normal={'start'} value={latest ? latest.turbidity : 0} unit={'NTU'} max={10} data={turbData}/>
            <DataBox parameter={'pH'} p1={6.5} p2={8.5} normal={'mid'} value={latest ? latest.ph : 0} max={14} data={phData}/>
        </div>
        {/* <LiveReading /> */}
    </div>
  );
}

export default Dashboard;