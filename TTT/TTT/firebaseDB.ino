  void fdb::wifiBegin(){
    Serial.println("Connecting to WiFi");
    WiFi.begin(fdb::WIFI_SSID, fdb::WIFI_PASSWORD);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println(".");
      retries++;
      if (retries >= 20) {
        Serial.println("WiFi connection timeout");
        return;
      }
    }
    Serial.println("Connected");
  }

  float fdb::precise(float val){
    return roundf(val * 10.0f) / 10.0f;
  }

  void fdb::sendData(int sensorId, float tempValue, float tdsValue, float turbidityValue, float phValue) {
     (void)sensorId;
     if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Error: Not connected to WiFi");
      return;
    }

  String payload = "{\"ph\":" + String(precise(phValue)) + ",\"tds\":" + String(precise(tdsValue)) + ",\"turbidity\":" + String(precise(turbidityValue)) + ",\"temperature\":" + String(precise(tempValue)) + "}";

  Serial.println(payload);

  HTTPClient http;
  http.begin(fdb::BACKEND_URL); 
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", fdb::API_KEY);

  int httpResponseCode = http.POST(payload);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  String responsePayload = http.getString();
  Serial.print("Response body: ");
  Serial.println(responsePayload);

  http.end();
  }
