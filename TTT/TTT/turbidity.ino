float turbidity::getTdy(){
  float rawTotal = 0;
  for (int i = 0; i < turbidity::sampleCount; ++i) {
    rawTotal += analogRead(turbidity::turbidityPin);
    delay(10);
  }

  float averageReading = rawTotal / turbidity::sampleCount;
  float volt = averageReading * turbidity::adcReferenceVoltage / turbidity::adcMax;
  float normalized = (turbidity::clearWaterVoltage - volt) /
                     (turbidity::clearWaterVoltage - turbidity::dirtyWaterVoltage);

  if (normalized < 0.0f) {
    normalized = 0.0f;
  }
  if (normalized > 1.0f) {
    normalized = 1.0f;
  }

  float ntu = normalized * turbidity::maxNtu;

  if (ntu < 0.0f) {
    return 0.0f;
  }
  Serial.print("volt: ");
  Serial.println(volt);
  return ntu;
}
