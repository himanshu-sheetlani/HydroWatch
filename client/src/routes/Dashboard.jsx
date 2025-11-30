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
            <DataBox parameter={'TDS'} value={latest ? latest.tds : 0} unit={'PPM'} max={1000} data={tdsData}/>
            <DataBox parameter={'Temperature'} value={latest ? latest.temperature : 0} unit={'°C'} max={50} data={tempData}/>
            <DataBox parameter={'Turbidity'} value={latest ? latest.turbidity : 0} unit={'NTU'} max={15} data={turbData}/>
            <DataBox parameter={'pH'} value={latest ? latest.ph : 0} max={14} data={phData}/>
        </div>
        {/* <LiveReading /> */}
    </div>
  );
}

export default Dashboard;