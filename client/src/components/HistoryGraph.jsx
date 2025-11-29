import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function HistoryGraph() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(db, "tank/readings"); // ya jo path hai teri history ka
    onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // eslint-disable-next-line no-unused-vars
        const formatted = Object.entries(data).map(([key, val]) => ({
          time: new Date(val.timestamp).toLocaleTimeString(), // readable time for X-axis
          ph: Number(val.ph),
          tds: Number(val.tds),
          temperature: Number(val.temperature),
          turbidity: Number(val.turbidity),
        }));
        setHistory(formatted);
      }
    });
  }, []);

  return (
    <LineChart width={600} height={300} data={history}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="ph" stroke="#8884d8" />
      <Line type="monotone" dataKey="tds" stroke="#82ca9d" />
      <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
      <Line type="monotone" dataKey="turbidity" stroke="#387908" />
    </LineChart>
  );
}
