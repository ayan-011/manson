// // lib/tracks.ts

// export interface Track {
//   id: number
//   title: string
//   artist: string
//   poster: string
//   src: string
// }

// export const tracks: Track[] = [
//   // {
//   //   id: 1,
//   //   title: 'Chappa Chappa',
//   //   artist: 'Nova Ray',
//   //   poster: '/songs/1/chappa.webp',
//   //   src: '/songs/1/chappa.mp3',
//   // },
//   {
//     id: 1,
//     title: 'Blowingup',
//     artist: 'Lune & Vale',
//     poster: '/songs/2/second.jpeg',
//     src: '/songs/2/Blowingup.mp3',
//   },
//   {
//     id: 2,
//     title: 'Legacy',
//     artist: 'Lune & Vale',
//     poster: '/songs/3/Legacy.jpg',
//     src: '/songs/3/Legacy_Anthem_1.mp3',
//   },
  
// ]

// export const getTrackById = (id: number): Track | undefined =>
//   tracks.find((t) => t.id === id)

// export const getDefaultTrack = (): Track => tracks[0]