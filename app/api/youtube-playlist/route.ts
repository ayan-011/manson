import { NextResponse } from 'next/server'

interface YouTubePlaylistItem {
  snippet: {
    title: string
    channelTitle: string
    videoOwnerChannelTitle?: string
    resourceId: { videoId: string }
    thumbnails: {
      high?: { url: string }
      default?: { url: string }
    }
  }
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID

  if (!apiKey || !playlistId) {
    return NextResponse.json(
      { error: 'Missing YOUTUBE_API_KEY or YOUTUBE_PLAYLIST_ID in .env.local' },
      { status: 500 }
    )
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      const errBody = await res.text()
      return NextResponse.json(
        { error: `YouTube API error: ${errBody}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    const tracks = (data.items as YouTubePlaylistItem[]).map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
      poster:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url ||
        '',
    }))

    return NextResponse.json({ tracks })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 })
  }
}