#include <tttHeader.h>

void setup() {
  Serial.begin(115200);
  temp::temperatureSetup();
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  fdb::wifiBegin();
}

//NOTE: Wifi uses ADC2 GPIO pins. Avoid using those pins when using wifi.

void loop() {

  float temperature = temp::temperatureGet();
  if (temperature == temp::invalidTemperature) {
    Serial.println("Temperature sensor not detected");
  }

  float tds = tds::getTDS(temperature);
  
  float turbidity = turbidity::getTdy();

  float ph = ph::getpH();

  // Serial.println(temperature);
  // Serial.println(tds);
  // Serial.println(turbidity);
  // Serial.println(ph);
  // Serial.println();

  fdb::sendData(1, temperature, tds, turbidity, ph);

  delay(10000);
}
