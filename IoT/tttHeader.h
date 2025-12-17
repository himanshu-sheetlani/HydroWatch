#include <NTPClient.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <time.h>

// temperature
namespace temp{
  int ONE_WIRE_BUS = 4;  
  
  OneWire onewire = OneWire(ONE_WIRE_BUS);
  DallasTemperature sensors = DallasTemperature(&onewire);

  void temperatureSetup();
  float temperatureGet();
}


namespace turbidity{
  int turbidityPin = 35;

  float getTdy();
}

namespace ph{
  int phPin = 34;

  float getpH();
}


namespace tds{
  int tdsPin = 39;
  float referenceVoltage = 5.0;

  float calcTDSValue(float, float);
  float getTDS(float);
}

namespace fdb{
  const char* WIFI_SSID = "GDG3";
  const char* WIFI_PASSWORD = "123456789";

  const char* FIREBASE_PROJECT_ID = "hydrowatch-260c0";
  const char* FIREBASE_API_KEY = "AIzaSyDoVZQ_28zdkkNO5gZeFG97-s0L_titqHg";
  const char* RTDB_PATH = "tank/readings";
  const char* RTDB_REGION_URL_SUFFIX = ".asia-southeast1.firebasedatabase.app";

  void sendData(int, float, float, float, float);
  float precise(float);
  void wifiBegin();

}