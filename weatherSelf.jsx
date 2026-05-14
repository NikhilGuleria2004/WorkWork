import { useState, useEffect } from "react";

const API_KEY = "9d4c7d0e54e448cafa6fdb26ee891b96";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export default function WeatherLander(){
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // get weather data
  async function getWeather(cityName) {
    if (!cityName) return;

    setLoading(true);
    setError("");

    try {
      // current weather
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`
      );
      const weatherData = await weatherRes.json();

      // forecast
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`
      );
      const forecastData = await forecastRes.json();

      // error check
      if (weatherData.cod !== 200) {
        throw new Error("City not found");
      }

      setWeather(weatherData);

      // simple 5-day forecast
      const daily = forecastData.list.filter((item, index) => index % 8 === 0);

      setForecast(daily.slice(0, 5));
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    }

    setLoading(false);
  }

  // refetch when unit changes
  useEffect(() => {
    if (city) {
      getWeather(city);
    }
  }, [unit]);

  return(
     <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#0f172a",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >


    <h1 style={{ color: "white" }}>Weather App</h1>

      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button onClick={() => getWeather(city)}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div
      style={{
        marginBottom:"20px",
      }}
      >
        <button  onClick={()=>setUnit('metric')}>Celsius</button>
        <button  onClick={()=>setUnit('imperial')}>Farenheit</button>
      </div>


      {error && <p style={{color:"red"}}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <h1>{Math.round(weather.main.temp)} {unit==="metric" ?"C":"F"}</h1>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.main.speed}{" "} {unit==="metric"?"m/s":"mph"}</p>


        </div>
      )}

      {forecast.length>0 && (
        <div style={{marginTop:"30px"}}>
          <h3>5-Day Forecast</h3>

          {forecast.map((day,index)=>(
            <div key={index} style={{padding:"10px", border:"1px solid white"}}>
               <p>
                  {new Date(day.dt * 1000).toLocaleDateString()}
                </p>

                <p>
                {Math.round(day.main.temp)}
                {unit==="metric"?"C":"F"}
                </p>

                <p>{day.weather[0].main}</p>
                
            </div>
          ))}


        </div>
      )}

    </div>
  );

};
