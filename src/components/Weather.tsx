import { useEffect, useState } from 'react'
import axios from 'axios'
import Geo from './Geo';

interface WeatherData {
    current: {
        temperature_2m: number;
        weather_code: number;
    }
    daily: {
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        weather_code: number[]
        time: string[]
    }
}

const weatherCodeDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense intensity',
    56: 'Freezing Drizzle: Light',
    57: 'Freezing Drizzle: Dense intensity',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy intensity',
    66: 'Freezing Rain: Light',
    67: 'Freezing Rain: Heavy intensity',
    71: 'Snow fall: Slight',
    73: 'Snow fall: Moderate',
    75: 'Snow fall: Heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers: Slight',
    86: 'Snow showers: Heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Weather() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const fetchData = async () => {
        await axios
            .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`)
            .then(response => {
                setWeatherData(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [latitude, longitude])

    const handleGeoData = (lat: number, lon: number) => {
        setLatitude(lat)
        setLongitude(lon)
    }
    
    return (
        <>
            <Geo onGeoData={handleGeoData}/>

            <div className="flex flex-col justify-center items-center">
                {weatherData ? (
                    <>
                    <div>
                        <h1 className="text-[4rem]">{weatherData.current.temperature_2m}°C</h1>
                        <h2 className="text-[1rem]">{weatherCodeDescriptions[weatherData.current.weather_code]}</h2>
                    </div>

                    <ul className="flex gap-[1rem] mt-[3rem]">
                        {weatherData.daily.time.map((time, index) => {
                            const day = new Date(time).getDay()
                            return (
                                <li key={index} className="border rounded-[1rem] p-[2rem]">
                                    <p>{weekdays[day]}</p>
                                    <p>{weatherCodeDescriptions[weatherData.daily.weather_code[index]]}</p>
                                    <p>Max: {weatherData.daily.temperature_2m_max[index]}°C</p>
                                    <p>Min: {weatherData.daily.temperature_2m_min[index]}°C</p>
                                </li>
                            )
                        })}
                    </ul>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}