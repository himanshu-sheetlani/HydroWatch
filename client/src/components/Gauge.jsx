import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const Gauge = ({ value, text, max, colors }) => {
  return (
    <ReactSpeedometer
      minValue={0}
      maxValue={max}
      value={value}
      valueFormat=",.2f"
      segments={3}
      segmentColors={colors}
      needleColor="#fff"
      currentValueText={text}
      height={200}
    />
  );
};

export default Gauge;
