  void fdb::wifiBegin(){
    Serial.println("Connecting to WiFi");
    WiFi.begin(fdb::WIFI_SSID, fdb::WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println(".");
    }
    Serial.println("Connected");
  }

  float fdb::precise(float val){
    return (((int)(val * 10)) / 10.0f);
  }

  void fdb::sendData(int sensorId, float tempValue, float tdsValue, float turbidityValue, float phValue) {
     if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Error: Not connected to WiFi");
      return;
    }

  String url = "https://hydrowatch1.onrender.com/api/iot/push_readings";

  String payload = "{\"ph\":" + String(precise(phValue))+ ",\"tds\":" + String(precise(tdsValue)) + ",\"turbidity\":" + String(precise(turbidityValue))+ ",\"temperature\":" + String(precise(tempValue))+ "}";
  Serial.println(payload);

  HTTPClient http;
  http.begin(url); 
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", "");//have to had api key
  

  int httpResponseCode = http.POST(payload);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  String responsePayload = http.getString();
  Serial.print("Response body: ");
  Serial.println(responsePayload);

  http.end();
  }