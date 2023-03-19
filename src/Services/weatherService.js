import { DateTime } from "luxon";
const API_KEY = "";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  return fetch(url).then((response) => response.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dayInWeek = new Date().getDay();
const forecastDays = WEEK_DAYS.slice(dayInWeek, WEEK_DAYS.length).concat(
  WEEK_DAYS.slice(0, dayInWeek)
);
//////////////////// Need to subscribe to get hourly forecast//////////////////////////
const formatForecastWeather = (data) => {
  let { list } = data;
  list = list.slice(1, 6).map((d, idx) => {
    return {
      index: idx,
      title: forecastDays[idx],
      temp: d.main.temp,
      icon: d.weather[0].icon,
    };
  });
  //   hourly = hourly.slice(1, 6).map((d) => {
  //     return {
  //       title: formatToLocalTime(d.dt, timezone, "ccc"),
  //       temp: d.temp,
  //       icon: d.weather[0].icon,
  //     };
  //   });
  //   console.log("timezone------>", timezone);
  return { list };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  console.log("formattedCurrentWeather=-------->", formattedCurrentWeather);

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy'") =>
  DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { iconUrlFromCode, formatToLocalTime };
