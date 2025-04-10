import React from 'react'
import { Button } from 'react-bootstrap';

export const WeatherButton = ({ cities, city, setCity, onCurrentLocationClick }) => {
  return (
    <div>
        <Button
            variant={city === '' ? 'dark' : 'light'} 
            onClick={onCurrentLocationClick}
            style={{ marginRight: '5px' }}
        >
            Current Location
        </Button>

        {cities.map((item, index) => (
            <Button
                key={index}
                variant={city === item ? 'dark' : 'light'} 
                onClick={() => setCity(item)}
                style={{ marginRight: '5px' }}
                >
                {item}
            </Button>
        ))}
    </div>
  );
};
