import React from 'react'
import YouTubePlayer from './components/YouTubePlayer'
import Playlist from './components/Playlist' 
import { PlayerProvider } from '@/context/PlayerContext'

const Page: React.FC = () => {
  return (
    <PlayerProvider >
      <div>
        <img
          src="/bg2.png"
          alt=""
          className="w-full h-screen object-cover overflow-hidden opacity-80  "
        />
        <img
  src="/greek.gif"
  alt=""
  className="w-92 absolute left-32 top-32 opacity-90"
/>
        <YouTubePlayer />
        <Playlist />
      </div>
    </PlayerProvider>
  )
}

export default Page