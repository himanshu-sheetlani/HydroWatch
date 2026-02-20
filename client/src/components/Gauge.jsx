import React from "react";
import GaugeChart from "react-gauge-chart";

const Gauge = ({ value, max, colors, id = "gauge-chart5", percent, arcsLength, arcWidth, hideText = false }) => {
  const displayPercent = percent !== undefined ? percent : (value / (max || 100));
  
  return (
    <div className="w-full text-white">
      <GaugeChart
        id={id}
        nrElement={30}
        arcsLength={arcsLength || [0.3, 0.4, 0.3]}
        colors={colors || ["#5BE12C", "#F5CD19", "#EA4228"]}
        percent={displayPercent}
        arcPadding={0.02}
        cornerRadius={3}
        arcWidth={arcWidth || 0.2}
        needleColor="#ccc"
        needleBaseColor="#ccc"
        textColor="#fff"
        hideText={hideText}
        formatTextValue={() => value?.toFixed(2) || ""}
      />
    </div>
  );
};

export default Gauge;
