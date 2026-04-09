float tds::calcTDSValue(float sensorValue, float temperatureAtCollection) {
  // Convert the sensor pin reading to actual voltage:
  float sensorVoltage = sensorValue * tds::referenceVoltage / tds::adcMax;

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

  return calculatedTdsValue * tds::calibrationFactor;
}

float tds::getTDS(float temperature){
  float rawTotal = 0;
  for (int i = 0; i < tds::sampleCount; ++i) {
    rawTotal += analogRead(tds::tdsPin);
    delay(10);
  }

  float averageReading = rawTotal / tds::sampleCount;
  float compensatedTemperature = temperature;
  if (compensatedTemperature == temp::invalidTemperature || isnan(compensatedTemperature)) {
    compensatedTemperature = 25.0f;
  }

  auto val = calcTDSValue(averageReading, compensatedTemperature);

  return val;
}
