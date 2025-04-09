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
  const [searchInput, setSearchInput] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); 

  const cities = ['paris', 'new york', 'tokyo', 'seoul'];
  
  useEffect(() => {
    if (weather && weather.weather) {
      const weatherMain = weather.weather[0].main.toLowerCase();
      if (weatherMain.includes('rain')) {
        document.body.style.backgroundImage =
          "url('https://images.unsplash.com/photo-1493314894560-5c412a56c17c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFpbnklMjB3ZWF0aGVyfGVufDB8fDB8fHww`)";
      } else if (weatherMain.includes('cloud')) {
        document.body.style.backgroundImage =
          "url('https://grangers.co.uk/cdn/shop/articles/engin-akyurt-gJILnne_HFg-unsplash.jpg?v=1711643298')";
      } else if (weatherMain.includes('clear')) {
        document.body.style.backgroundImage =
          "url('https://clarksvillenow.sagacom.com/wp-content/blogs.dir/43/files/2020/10/shutterstock_206307496.jpg')";
      } else {
        document.body.style.backgroundImage =
          "url('https://cloudfront-us-east-1.images.arcpublishing.com/gray/JFDZ7U577FFBTCTSLUKDQDSAYQ.png')";
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
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d714a94abc375fdc877a122ff4402bab&units=metric&lang=kr`
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
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d714a94abc375fdc877a122ff4402bab&units=metric&lang=kr`;
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
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=d714a94abc375fdc877a122ff4402bab&lang=kr`);
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
        <div style={{ marginBottom: '20px', position: 'relative' }}>
        <input
              type="text"
              placeholder="Search city..."
              value={searchInput}
              onChange={handleSearchChange}
              style={{ padding: '8px', borderRadius: '8px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '8px 12px' }}>Search</button>
        {suggestions.length > 0 && (
              <ul className="suggestion-box">
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
        <div style={{ marginTop: '20px' }}>
          <WeatherButton cities={cities} city={city} setCity={setCity} onCurrentLocationClick={handleCurrentLocationClick}
          />
        </div>
      </div>
      )}
    </div>
  );
}
export default App;
