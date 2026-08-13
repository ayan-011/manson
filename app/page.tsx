import React from 'react'
import YouTubePlayer from './components/YouTubePlayer'
import Playlist from './components/Playlist' 
import { PlayerProvider } from '@/context/PlayerContext'

const Page: React.FC = () => {
  return (
    <PlayerProvider >
      <div>
        <img
          src="/bg1.png"
          alt=""
          className="w-full h-screen object-cover overflow-hidden opacity-80  "
        />
        <div className="absolute flex gap-2 lg:p-5 p-2 lg:left-3 lg:top-0 top-5 bg- itemscenter">

          <h1 className='  left-0 top-0 lg:text-2xl  text-lg flex items-center tracking- font-bold might text-white/80'>MISTRI</h1>
        <img
  src="/greek.gif"
  alt=""
  className="md:w-10 w-6 left-2 top-2 opacity-90"
/>
        </div>
<h1 className='  might absolute w-full px-4 text-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-auto 
                 lg:px-0 lg:text-left lg:left-32 lg:top-48 lg:translate-x-14 lg:translate-y-0 font-bold text-red-600
                  flex flex-col'>
  <span className='  text-[30vw] sm:text-[32vw] lg:text-[11vw] lg:tracking-tighter tracking-tight leading-none'>
    8 <span className="text-white/80 ">to</span> 6
  </span>
  <span className='text-[17vw] ml-1 sm:text-[17vw] lg:text-[6vw] text-white/80 -mt-5 lg:-mt-1 leading-none'>
    NONSTOP
  </span>
</h1>
        <YouTubePlayer />
        <Playlist />
      </div>
    </PlayerProvider>
  )
}

export default Page