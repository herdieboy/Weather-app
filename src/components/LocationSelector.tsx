import { useState, useEffect } from 'react'
import axios from 'axios'

interface GeoData {
    results: {
        name: string
        country: string
        latitude: number
        longitude: number
    }[]
}

interface GeoProps {
    onGeoData: (latitude: number, longitude: number) => void;
}

export default function LocationSelector({ onGeoData} : GeoProps) {
    const [geoData, setGeoData] = useState<GeoData | null>(null)
    const [city, setCity] = useState<string>('Copenhagen')
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        await axios
            .get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=2&language=en&format=json`)
            .then(response => {
                if ( response.data && response.data.results && response.data.results[0] && typeof response.data.results[0].name === 'string' ) {
                    setGeoData(response.data)
                    setError(null)
                    onGeoData(response.data.results[0].latitude, response.data.results[0].longitude)
                    console.log(response.data)
                } else {
                    throw new Error('City not found')
                }
            })
            .catch(error => {
                setError('City not found')
                console.error(error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            fetchData()
        }
    }

    return (
        <div className="z-50 w-full flex flex-col p-[1rem] pb-[0.5rem] shadow-[0_0_5px_10px_#171933]">
            <input className="border rounded-full px-[1rem] py-[0.25rem] mb-[0.5rem] bg-transparent" type="text" value={city} onChange={(event) => setCity(event.target.value)} onKeyUp={handleKeyPress} />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {geoData ? (
                <div>
                    <p>{geoData.results[0].name}, {geoData.results[0].country}</p>
                </div>
            ) : (
                !error && <p>Search for a location</p>
            )}
        </div>
    )

}