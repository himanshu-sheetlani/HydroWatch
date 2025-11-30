import GaugeChart from "./Gauge.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DataBox({parameter, p1, p2, normal, value, unit, max, data = [] }){
  
  let status = "Normal";
  if (normal === "mid") {
      if (value > p1 && value <= p2) {
      status = "Normal";
    } else if (value > p2) {
      status = "High";
    } else {
      status = "Low";
    }
  }
  else{
    if (value > p1 && value <= p2) {
      status = "Little high";
    } else if (value > p2) {
      status = "High";
    }
  }
  return (
    <div className="p-10 flex rounded-2xl m-15 mt-10 w-180 ring flex-wrap border border-gray-700 position-relative hover:shadow-md hover:scale-102 hover:shadow-gray-500 hover:bg-zinc-900 transition">
      <div className="">
        <div className="w-85">
          <GaugeChart
            value={value}
            text={status}
            max={max}
            id="turbidity-gauge"
            colors={normal === 'mid' ? ["#FFB347", "#00C49F", "#FFB347"]:["#00C49F", "#FFB347", "#FF6347"] }
            percent={Math.min(value / 20, 1)}
            hideText={true}
            arcsWidth={[0.1, 0.2, 0.6]}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-gray-300 text-2xl font-bold tracking-wide">
            {parameter}: &nbsp;&nbsp;
          </h2>
          <div className="align-center">
            <p className="text-5xl font-semibold">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{unit}</p>
          </div>
        </div>
    
        <div className="mt-4 h-24 w-70">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" stroke="#555" tick={{ fontSize: 10 }} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1C1F26",
                  border: "none",
                  color: "#fff",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FFB347"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}