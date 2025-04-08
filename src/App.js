import { useEffect, useState, useCallback } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { WeatherBox } from './component/WeatherBox.js';
import { WeatherButton } from './component/WeatherButton';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(''); // +
  const [suggestions, setSuggestions] = useState([]); // +

  const cities = ['paris', 'new york', 'tokyo', 'seoul'];
  
  useEffect(() => {
    if (weather && weather.weather) {
      const weatherMain = weather.weather[0].main.toLowerCase();
      if (weatherMain.includes('rain')) {
        document.body.style.backgroundImage =
          "url('https://png.pngtree.com/thumb_back/fw800/background/20190222/ourmid/pngtree-night-sky-raining-cartoon-illustration-background-design-skymoonrainrainillustration-backgroundadvertising-backgroundbackground-image_59483.jpg`)";
      } else if (weatherMain.includes('cloud')) {
        document.body.style.backgroundImage =
          "url('https://www.shutterstock.com/image-illustration/abstract-cloudy-sky-background-thick-260nw-2222157737.jpg')";
      } else if (weatherMain.includes('clear')) {
        document.body.style.backgroundImage =
          "url('https://img.freepik.com/free-vector/sun-light-with-clouds-sky-background_1017-38299.jpg?semt=ais_hybrid&w=740')";
      } else {
        document.body.style.backgroundImage =
          "url('https://media.istockphoto.com/id/1450092137/ko/%EB%B2%A1%ED%84%B0/%EC%95%88%EA%B0%9C-%EC%97%B0%EA%B8%B0-%EB%B0%94%EB%8B%A5%EC%97%90-%ED%9D%B0-%EC%8A%A4%EB%AA%A8%EA%B7%B8-%EA%B5%AC%EB%A6%84-%EC%95%88%EA%B0%9C-%EC%95%88%EA%B0%9C.jpg?s=612x612&w=0&k=20&c=UdsOU9KgL6oJ4_Jkf8S9NWFkm1RC0cg7GMOM_ng7rVw=')";
      }
    }
  }, [weather]);

  const getCurrentLocation = useCallback(() => {
      navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat, lon);
    });
  }, []);

  const getWeatherByCurrentLocation = async(lat, lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d714a94abc375fdc877a122ff4402bab&units=metric`
    try {
      setLoading(true);
    let response = await fetch(url)
    let data = await response.json();
    setWeather(data);
    setLoading(false);
    } catch (error) {
      console.log("에러 발생: ", error);
      setLoading(false);
    }
  }

  const getWeatherByCity = useCallback(async() => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d714a94abc375fdc877a122ff4402bab&units=metric`;
    try {
      setLoading(true);
    let response = await fetch(url)
    let data = await response.json();
    setWeather(data);
    setLoading(false);
    } catch (error) {
      console.log("에러 발생: ", error);
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    if(city===""){
      getCurrentLocation();
    } else {
      getWeatherByCity();
    }
  },[city, getCurrentLocation, getWeatherByCity])

  const handleSearchChange = async(e) => {
    // const value = e.target.value;
    // setSearchInput(value);
    // if (value.length > 0) {
    //   const filtered = cities.filter((cityName) =>
    //     cityName.toLowerCase().includes(value.toLowerCase())
    //   );
    //   setSuggestions(filtered);
    // } else {
    //   setSuggestions([]);
    // }
    const value = e.target.value;
    setSearchInput(value);
    if (value.length > 0) {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=d714a94abc375fdc877a122ff4402bab`);
        const data = await response.json();
        const cityNames = data.map(city => city.name);
        setSuggestions(cityNames);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      setCity(searchInput);
      setSearchInput("");
      setSuggestions([]);
    }
  };

  const handleCurrentLocationClick = () => {
    setCity("");
  };

  const handleSuggestionClick = (suggestedCity) => {
    setCity(suggestedCity);
    setSearchInput("");
    setSuggestions([]);
  };

  return (
    <div>
      {loading ? (
        <div className='container'>
          <ClipLoader color="#f88c6b" loading={loading} size={150} />
        </div>
      ) : (
      <div className='container'>
        <div style={{ marginBottom: '20px' }}>
        <input
              type="text"
              placeholder="Search city..."
              value={searchInput}
              onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
        {suggestions.length > 0 && (
              <ul style={{ background: 'white', marginTop: '5px' }}>
                {suggestions.map((suggestedCity, idx) => (
                  <li
                    key={idx}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSuggestionClick(suggestedCity)}
                  >
                    {suggestedCity}
                  </li>
                ))}
              </ul>
          )}
        </div>

        <WeatherBox weather={weather}/>
        <WeatherButton cities={cities} city={city} setCity={setCity} onCurrentLocationClick={handleCurrentLocationClick}
        />
      </div>
      )}
    </div>
  );
}
export default App;
