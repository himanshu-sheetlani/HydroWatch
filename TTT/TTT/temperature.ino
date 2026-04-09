void temp::temperatureSetup(){
  temp::sensors.begin();
  temp::sensors.setWaitForConversion(true);
}

float temp::temperatureGet(){
    temp::sensors.requestTemperatures();
    float temperature = temp::sensors.getTempCByIndex(0);
    if (temperature == DEVICE_DISCONNECTED_C) {
      return temp::invalidTemperature;
    }
    return temperature;
}
