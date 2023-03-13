import "./App.css";
import { useEffect, useState } from "react";
import Forecast from "./Components/Forecast";
import Inputs from "./Components/Inputs";
import TempAndDetail from "./Components/TempAndDetail";
import TimeAndLocation from "./Components/TimeAndLocation";
import TopButtons from "./Components/TopButtons";
import getFormattedWeatherData from "./Services/weatherService";
// import getWeatherData from "./Services/weatherService";
// import UilReact from '@iconscout/react-unicons/icons/uil-react';

function App() {
  const [query, setQuery] = useState({ q: "london" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) => {
        setWeather(data);
        console.log("data------>", data);
      });
    };
    fetchWeather();
  }, [query, units]);

  return (
    <div className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400">
      <TopButtons />
      <Inputs />

      {weather && (
        <div>
          <TimeAndLocation weather={weather} />
          <TempAndDetail weather={weather} />

          {/* Need to subscribe for hourly forecast */}
          {/* <Forecast title="Hourly Forecast" /> */}

          <Forecast title="daily forecast" items={weather.list} />
        </div>
      )}
    </div>
  );
}

export default App;
