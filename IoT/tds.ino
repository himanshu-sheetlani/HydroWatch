float tds::calcTDSValue(float sensorValue, float temperatureAtCollection) {
  // Convert the sensor pin reading to actual voltage:
  float sensorVoltage = sensorValue * tds::referenceVoltage / 1024.0;

  // temperature compensation formula: fFinalResult(25^C) =
  // fFinalResult(current)/(1.0+0.02*(fTP-25.0))
  float compensationCoefficient = 1.0 + 0.02 * (temperatureAtCollection - 25.0);

  float compensationVoltage = sensorVoltage / compensationCoefficient;

  // voltage to tds
  float calculatedTdsValue =
      (133.42 * compensationVoltage * compensationVoltage *
           compensationVoltage -
       255.86 * compensationVoltage * compensationVoltage +
       857.39 * compensationVoltage) *
      0.5;

  return calculatedTdsValue;
}

float tds::getTDS(float temperature){
  float voltage = analogRead(tds::tdsPin);
  auto temp = calcTDSValue(voltage, temperature);

  return temp;
}