float turbidity::getTdy() {
  float volt = 0, ntu = 0;
  for (int i = 0; i < 800; ++i) {
    volt += ((float)analogRead(turbidity::turbidityPin) / 1023) * 5;
  }

  volt /= 800;
  volt = roundf(volt * 10.0) / 10.0;

  if (volt < 2.5) {
    ntu = 3000;
  } else {
    ntu = -1120.4 * (volt * volt) + 5742.3 * volt - 4353.8;
  }

  return ntu;
}