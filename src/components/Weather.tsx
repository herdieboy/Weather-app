import { useEffect, useState } from 'react'
import axios from 'axios'
import Geo from './Geo'

import drizzle from '../assets/icons/cloud-drizzle.svg'
import lightning from '../assets/icons/cloud-lightning.svg'
import rain from '../assets/icons/cloud-rain.svg'
import snow from '../assets/icons/cloud-snow.svg'
import cloud from '../assets/icons/cloud.svg'
import sun from '../assets/icons/sun.svg'


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

const weatherCodeIcons: { [key: number]: string } = {
    0: sun,
    1: sun,
    2: sun,
    3: cloud,
    45: cloud,
    48: cloud,
    51: drizzle,
    53: drizzle,
    55: drizzle,
    56: drizzle,
    57: drizzle,
    61: rain,
    63: rain,
    65: rain,
    66: rain,
    67: rain,
    71: snow,
    73: snow,
    75: snow,
    77: snow,
    80: rain,
    81: rain,
    82: rain,
    85: snow,
    86: snow,
    95: lightning,
    96: lightning,
    99: lightning
}

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

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

            <div className="flex flex-col justify-center items-center mt-[4rem]">
                {weatherData ? (
                    <>
                    <div className="flex flex-col items-center">
                        <img className="text-[1rem]" src={weatherCodeIcons[weatherData.current.weather_code]}></img>
                        <h1 className="text-[4rem]">{Math.round(weatherData.current.temperature_2m)}°C</h1>
                    </div>

                    <ul className="flex gap-[1rem] mt-[3rem]">
                        {weatherData.daily.time.map((time, index) => {
                            const day = new Date(time).getDay()
                            return (
                                <li key={index} className="flex flex-col items-center">
                                    <p>{weekdays[day]}</p>
                                    <img className="w-[2rem]" src={weatherCodeIcons[weatherData.daily.weather_code[index]]}></img>
                                    <p>{Math.round(weatherData.daily.temperature_2m_max[index])}°C</p>
                                    <p>{Math.round(weatherData.daily.temperature_2m_min[index])}°C</p>
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