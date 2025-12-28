const apiKey = "0285436202e5ec848c99e0a9869ab64b";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = "Please enter a city name.";
    return;
  }

  // 1️⃣ Weather API (for lat & lon)
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        resultDiv.innerHTML = "City not found!";
        return;
      }

      const { lat, lon } = data.coord;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // 2️⃣ Air Quality API
      fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
        .then(res => res.json())
        .then(aqiData => {
          const aqi = aqiData.list[0].main.aqi;
          const aqiText = getAQIText(aqi);

          resultDiv.innerHTML = `
            <h3>${data.name}</h3>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>🌡 Temperature: ${data.main.temp} °C</p>
            <p>☁ Weather: ${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌫 Air Quality: <strong>${aqiText}</strong></p>
          `;
        });
    })
    .catch(err => {
      resultDiv.innerHTML = "Error fetching data.";
      console.error(err);
    });
}

// AQI meaning
function getAQIText(aqi) {
  switch (aqi) {
    case 1: return "Good 😊";
    case 2: return "Fair 🙂";
    case 3: return "Moderate 😐";
    case 4: return "Poor 😷";
    case 5: return "Very Poor ☠️";
    default: return "Unknown";
  }
}

