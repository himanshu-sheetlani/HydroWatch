float ph::getpH(){
  float rawTotal = 0;
  for(int i = 0; i < ph::sampleCount; ++i){
    rawTotal += analogRead(ph::phPin);
    delay(10);
  }

  float averageReading = rawTotal / ph::sampleCount;
  float volt = averageReading * ph::adcReferenceVoltage / ph::adcMax;
  float phValue = 7.0f + ((ph::neutralVoltage - volt) / ph::voltagePerPH) + ph::calibrationOffset;

  if (phValue < 0.0f) {
    return 0.0f;
  }
  if (phValue > 14.0f) {
    return 14.0f;
  }

  return phValue;
}
