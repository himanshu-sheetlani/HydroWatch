#include <tttHeader.h>

void setup() {
  Serial.begin(115200);
  temp::temperatureSetup();
}

//NOTE: Wifi uses ADC2 GPIO pins. Avoid using those pins when using wifi capabilities.

void loop() {

  float temperature = temp::temperatureGet();

  float tds = tds::getTDS(fdb::precise(temperature));
  
  float turbidity = turbidity::getTdy();

  float ph = ph::getpH();

  Serial.println(temperature);
  Serial.println(tds);
  Serial.println(turbidity);
  Serial.println(ph);
  Serial.println();

  // fdb::wifiBegin();
  // fdb::sendData(1, temperature, tds, turbidity, ph);

  delay(2000);
}
