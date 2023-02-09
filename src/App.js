import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import Spinner from "./Spinner";
import { useEffect, useState, Suspense } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;
  console.log(API_KEY);
  useEffect(() => {
    const fetchWeatherData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
      const data = await getFormattedWeatherData(
        city,
        units,
        lat,
        long,
        API_KEY
      );
      setWeather(data);

      // dynamic bg
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city, lat, long]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <Suspense delayMs={10} fallback={<Spinner size="medium" />}>
      <div className="app" style={{ backgroundImage: `url(${bg})` }}>
        <div className="overlay">
          {weather && (
            <div className="container">
              <div className="section section__inputs">
                <input
                  onKeyDown={enterKeyPressed}
                  type="text"
                  name="city"
                  placeholder="Quiere ver otra ciudad..."
                />
                <button onClick={(e) => handleUnitsClick(e)}>°F</button>
              </div>

              <div className="section section__temperature">
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} °${
                    units === "metric" ? "C" : "F"
                  }`}</h1>
                </div>
              </div>

              {/* bottom description */}
              <Descriptions weather={weather} units={units} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default App;
