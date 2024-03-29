import React, { useEffect, useState } from 'react'
import Summary from '../components/Summary'
import HistoryList from '../components/HistoryList'
import Sun from '../assets/sun.png'
import Search from '../components/Search'
import { getLocationWeather } from './App.service'
import { WeatherData, History } from './App.types'
import {
  getLocalStorageHistories,
  saveToLocalStorage,
} from '../services/localStorage'
import Loader from '../components/Loader'
import NotFoundBar from '../components/NotFoundBar'

const defaultWeatherData: WeatherData = {
  country: '',
  dt: 0,
  main: {
    temp: 0,
    feels_like: 0,
    temp_min: 0,
    temp_max: 0,
    pressure: 0,
    humidity: 0,
    sea_level: 0,
    grnd_level: 0,
  },
  name: '',
  desc: '',
}

const App: React.FC = () => {
  const [histories, setHistories] = useState<History[]>([])
  const [weather, setWeather] = useState<WeatherData>(defaultWeatherData)
  const [search, setSearch] = useState('')
  const [selectedHistory, setSelectedHistory] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const getWeather = async (location: string) => {
    try {
      setIsLoading(true)
      setErrorMsg('')
      const res: any = await getLocationWeather(location)
      setWeather(res)
      const historyData = {
        name: res.name,
        country: res.country,
        dt: res.dt,
      }
      setHistories((prevHistories) => {
        const newArr = prevHistories
          ? [historyData, ...prevHistories]
          : [historyData]
        saveToLocalStorage(newArr)
        return newArr
      })
    } catch (err: any) {
      setErrorMsg(err.message)
    }
    setIsLoading(false)
  }

  const handleSelectHistory = (index) => {
    const name = histories[index].name
    setSelectedHistory(name)
  }
  const handleDeleteHistory = (index) => {
    const updatedHistories = [...histories]
    updatedHistories.splice(index, 1)
    saveToLocalStorage(updatedHistories)
    setHistories(updatedHistories)
  }

  useEffect(() => {
    if (search) {
      getWeather(search)
    }
    // No need for eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedHistory, setHistories])

  useEffect(() => {
    const localStorageHistories = getLocalStorageHistories()
    setIsLoading(true)
    setHistories(localStorageHistories)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (selectedHistory) {
      setSearch('')
      getWeather(selectedHistory)
    }
  }, [selectedHistory])

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex flex-col items-center justify-center'>
        {errorMsg && <NotFoundBar errorMsg={errorMsg} />}
        <Search placeholder='Country' onChange={setSearch} />
        <img
          width={'600px'}
          height={'600px'}
          src={Sun}
          className='xm:w-52 absolute right-4 top-20 z-10 w-40 sm:right-28 md:right-32 md:w-72 lg:right-64 lg:w-72 xl:right-[420px] xl:top-16'
          alt='Sun'
        />
        <div className='z-0 flex h-full w-11/12 flex-col items-center rounded-t-3xl border-[1px] border-white border-opacity-50 bg-white bg-opacity-25 md:w-10/12 lg:w-3/5 lg:max-w-[700px]'>
          <span className='z-10 flex w-11/12 flex-col lg:w-10/12'>
            <Summary data={weather} />
            <HistoryList
              data={histories}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
            />
          </span>
        </div>
      </div>
    </>
  )
}

export default App
