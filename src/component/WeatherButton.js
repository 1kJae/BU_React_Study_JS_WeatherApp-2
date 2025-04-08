import React from 'react'
import { Button } from 'react-bootstrap';

export const WeatherButton = ({ cities, city, setCity, onCurrentLocationClick }) => {
  return (
    <div>
        <Button
            variant={city === '' ? 'primary' : 'warning'} 
            onClick={onCurrentLocationClick}
            style={{ marginRight: '5px' }}
        >
            Current Location
        </Button>

        {cities.map((item, index) => (
            <Button
                key={index}
                variant={city === item ? 'primary' : 'warning'} // [변경2] 클릭된 버튼 표시
                onClick={() => setCity(item)}
                style={{ marginRight: '5px' }}
                >
                {item}
            </Button>
        ))}
    </div>
  );
};
