import { useState } from "react";
import "./App.css";

export default function App() {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedCity = cityName.trim();
    if (!trimmedCity) return;

    setLoading(true);
    setErrorMessage("");
    setWeather(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Error ${response.status}: Failed to fetch weather`,
        );
      }

      setWeather(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setWeather(null);
      setErrorMessage(err.message || "Failed to connect to weather service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city..."
          className="js-input"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button
          type="submit"
          className="submit-btn"
          aria-label="Search"
          disabled={loading}
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {errorMessage && (
        <p
          className="js-invalid-city"
          style={{ color: "red", marginTop: "10px" }}
        >
          {errorMessage}
        </p>
      )}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <div>
            <span>{Math.round(weather.main.temp)}°C</span>
          </div>
          <p>{weather.weather[0].main}</p>
          <p>{weather.weather[0].description}</p>
          <div>
            <div>
              <span>Wind Speed: </span>
              <span>{weather.wind.speed} m/s</span>
            </div>
            <div>
              <span>Humidity: </span>
              <span>{weather.main.humidity}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
