float ph::getpH() {
  float voltage = analogRead(ph::phPin);
  float val = 6.9 + (random(0, 601) / 100.0);

  return val;
}

float getPH1(){
  float volt = 0;
  for(int i = 0; i < 10; ++i){
    volt += analogRead(ph::phPin);
  }

  volt = (float) volt * 5.0 / 1024 / 4.3;
  float phValue = -5.70 * volt + 29.5;
  phValue = 14.2 - phValue;
  
  return phValue;
}