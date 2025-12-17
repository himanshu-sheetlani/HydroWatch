void temp::temperatureSetup(){
  temp::sensors.begin();
}

float temp::temperatureGet(){
    temp::sensors.requestTemperatures();
    return temp::sensors.getTempCByIndex(0);
}