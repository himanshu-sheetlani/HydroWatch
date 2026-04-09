#include <NTPClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <time.h>
#include <math.h>

// temperature
namespace temp{
  int ONE_WIRE_BUS = 4;  
  
  OneWire onewire = OneWire(ONE_WIRE_BUS);
  DallasTemperature sensors = DallasTemperature(&onewire);
  constexpr float invalidTemperature = -127.0f;

  void temperatureSetup();
  float temperatureGet();
}


namespace turbidity{
  int turbidityPin = 35;
  constexpr int sampleCount = 20;
  constexpr float adcMax = 4095.0f;
  constexpr float adcReferenceVoltage = 3.3f;
  // constexpr float clearWaterVoltage = 2.40f;
  // constexpr float dirtyWaterVoltage = 1.80f;
  constexpr float clearWaterVoltage = 0.5f;
  constexpr float dirtyWaterVoltage = 0.6f;
  constexpr float maxNtu = 3000.0f;

  float getTdy();
}

namespace ph{
  int phPin = 34;
  constexpr int sampleCount = 10;
  constexpr float adcMax = 4095.0f;
  constexpr float adcReferenceVoltage = 3.3f;
  // constexpr float neutralVoltage = 2.50f;
  // constexpr float voltagePerPH = 0.18f;
  constexpr float neutralVoltage = 2.27f;
constexpr float voltagePerPH = 0.2575f;
  constexpr float calibrationOffset = 0.0f;

  float getpH();
}


namespace tds{
  int tdsPin = 39;
  constexpr int sampleCount = 30;
  constexpr float adcMax = 4095.0f;
  constexpr float referenceVoltage = 3.3f;
  constexpr float calibrationFactor = 1.7476f;

  float calcTDSValue(float, float);
  float getTDS(float);
}

namespace fdb{
  const char* WIFI_SSID = "moto g64 5G";             // ENTER DETAILS BEFORE UPLOADING
  const char* WIFI_PASSWORD = "abcd1234";
  const char* BACKEND_URL = "https://hydrowatch1.onrender.com/api/iot/push_readings";
  const char* API_KEY = "";

  void sendData(int, float, float, float, float);
  float precise(float);
  void wifiBegin();

}
