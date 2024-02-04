import React, { useEffect, useState } from 'react'
import Summary from './components/Summary'
import { mockHistory } from './constants/mockData'
import HistoryList from './components/HistoryList'
import Sun from './assets/sun.png'
import Search from './components/Search'

type History = {
  location: string
  date: string
}

const App: React.FC = () => {
  const [histories, setHistories] = useState<History[]>([])

  const getHistories = async () => {
    setHistories(mockHistory)
  }

  useEffect(() => {
    getHistories()
  }, [])

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <Search placeholder='Country' />
        <img
          width={'300px'}
          height={'300px'}
          src={Sun}
          className='xm:w-52 absolute right-4 top-20 z-10 w-40 sm:right-28 md:right-32 md:w-72 lg:right-80'
          alt='Sun'
        />
        <div className='z-0 flex h-full w-11/12 flex-col items-center rounded-3xl border-[1px] border-white border-opacity-50 bg-white bg-opacity-25 md:w-10/12 lg:w-3/5 lg:max-w-[700px]'>
          <span className='z-10 flex w-11/12 flex-col lg:w-10/12'>
            <Summary />
            <HistoryList data={histories} />
          </span>
        </div>
      </div>
    </>
  )
}

export default App
