import { useEffect, useState } from 'react'
import axios from 'axios'
import LocationSelector from './LocationSelector'
import {splitTime, getDate} from './Helpers'

import drizzle from '../assets/icons/cloud-drizzle.svg'
import lightning from '../assets/icons/cloud-lightning.svg'
import rain from '../assets/icons/cloud-rain.svg'
import snow from '../assets/icons/cloud-snow.svg'
import cloud from '../assets/icons/cloud.svg'
import sun from '../assets/icons/sun.svg'


interface WeatherData {
    current: {
        temperature_2m: number
        weather_code: number
        precipitation: number
        is_day: number
        wind_speed_10m: number
        wind_gusts_10m: number
    }
    hourly: {
        time: string[]
        temperature_2m: number[]
        weather_code: number[]
        precipitation: number[]
        wind_speed_10m: number[]
        wind_gusts_10m: number[]
    }
}

const weatherCodeIcons: { [key: number]: string } = {
    0: sun, 1: sun, 2: sun,
    3: cloud, 45: cloud, 48: cloud,
    51: drizzle, 53: drizzle, 55: drizzle, 56: drizzle, 57: drizzle,
    61: rain, 63: rain, 65: rain, 66: rain, 67: rain,
    71: snow, 73: snow, 75: snow, 77: snow,
    80: rain, 81: rain, 82: rain,
    85: snow, 86: snow,
    95: lightning, 96: lightning, 99: lightning
}

export default function Weather() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [latitude, setLatitude] = useState<number | null>(55.6759)
    const [longitude, setLongitude] = useState<number | null>(12.5655)
    const todayDay = splitTime(getDate().start + "T00:00").weekday

    const fetchData = async () => {
        await axios
            .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&wind_speed_unit=ms&timezone=Europe%2FBerlin&start_date=${getDate().start}&end_date=${getDate().end}`)
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
    }, [])

    const handleGeoData = (lat: number, lon: number) => {
        setLatitude(lat)
        setLongitude(lon)
    }

    const groupByDay = (data: WeatherData) => {
        const grouped: { [key: string]: any[] } = {} 
        data.hourly.time.forEach((time, index) => {
            const { weekday } = splitTime(time) 
            if (!grouped[weekday]) {
                grouped[weekday] = [] 
            }
            grouped[weekday].push({
                time,
                temperature: data.hourly.temperature_2m[index],
                weather_code: data.hourly.weather_code[index],
                precipitation: data.hourly.precipitation[index],
                wind_speed: data.hourly.wind_speed_10m[index],
                wind_gusts: data.hourly.wind_gusts_10m[index]
            }) 
        }) 
        return grouped 
    } 
    
    return (
        <>
            <LocationSelector onGeoData={handleGeoData}/>

            <div className="snap-x snap-mandatory overscroll-none flex flex-row md:flex-col overflow-scroll">
                {weatherData ? (<>
                    {Object.entries(groupByDay(weatherData)).map(([weekday, data]) => (
                        
                        weekday === todayDay ?

                            <div key={weekday} className="snap-center w-screen min-w-[calc(100vw)] max-w-[calc(100vw-2rem)] h-full px-[1rem] overflow-scroll md:overflow-auto">
                                <img className="w-[6rem] m-auto" src={weatherCodeIcons[weatherData.current.weather_code]}></img>
                                <h1 className="text-[4rem]">{Math.round(weatherData.current.temperature_2m)}°C</h1>
                                <p>{Math.round(weatherData.current.precipitation)}mm</p>
                                <p>{Math.round(weatherData.current.wind_speed_10m)}({Math.round(weatherData.current.wind_gusts_10m)})m/s</p>

                                <ul className="flex flex-col md:flex-row gap-[1rem] mt-[1rem] rounded-[1rem] pb-[2rem] md:overflow-scroll">
                                    {data.map((item, index) => (
                                        <li key={index} className="flex flex-row md:flex-col justify-between items-center gap-4 bg-[#1b283c] p-[1rem] rounded-[1rem]">
                                            <p>{splitTime(item.time).hour}</p>
                                            <img className="w-[2rem]" src={weatherCodeIcons[item.weather_code]} alt="weather icon" />
                                            <p>{Math.round(item.temperature)}°C</p>
                                            <p>{Math.round(item.precipitation)}mm</p>
                                            <p>{Math.round(item.wind_speed)}({Math.round(item.wind_gusts)})m/s</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        :
                            <div key={weekday} className="snap-center w-screen min-w-[calc(100vw)] max-w-[calc(100vw-2rem)] h-full px-[1rem] overflow-scroll md:overflow-auto">
                                <h2 className="text-[3rem]">{weekday}</h2>
                                <ul className="flex flex-col md:flex-row gap-[1rem] mt-[1rem] rounded-[1rem] pb-[2rem] md:overflow-scroll">
                                    {data.map((item, index) => (
                                        <li key={index} className="flex flex-row md:flex-col justify-between items-center gap-4 bg-[#1b283c] p-[1rem] rounded-[1rem]">
                                            <p>{splitTime(item.time).hour}</p>
                                            <img className="w-[2rem]" src={weatherCodeIcons[item.weather_code]} alt="weather icon" />
                                            <p>{Math.round(item.temperature)}°C</p>
                                            <p>{Math.round(item.precipitation)}mm</p>
                                            <p>{Math.round(item.wind_speed)}({Math.round(item.wind_gusts)})m/s</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    ))}</>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}