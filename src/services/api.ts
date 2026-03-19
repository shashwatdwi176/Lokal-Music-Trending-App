import axios from 'axios';

const BASE_URL = 'https://saavn.sumit.co/api';
const FALLBACK_URL = 'https://saavn.dev/api';

const api = axios.create({
  timeout: 12000,
});


export interface ImageQuality {
  quality: string;
  link: string;
}

export interface DownloadUrl {
  quality: string;
  link: string;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  image: ImageQuality[];
  url?: string;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  primaryArtists: string;
  featuredArtists: string;
  artists: {
    primary: Artist[];
    featured?: Artist[];
    all?: Artist[];
  };
  image: ImageQuality[];
  downloadUrl: DownloadUrl[];
  url: string;
  hasLyrics?: boolean;
  lyricsId?: string;
}

export const getImageUrl = (song: Song, quality: string = '500x500'): string => {
  return (
    song.image?.find((i) => i.quality === quality)?.link ||
    song.image?.[song.image.length - 1]?.link ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(song.name)}&background=1DB954&color=fff&size=500`
  );
};

export const getDownloadUrl = (song: Song): string => {
  return (
    song.downloadUrl?.find((d) => d.quality === '320kbps')?.link ||
    song.downloadUrl?.find((d) => d.quality === '160kbps')?.link ||
    song.downloadUrl?.[song.downloadUrl.length - 1]?.link ||
    ''
  );
};

const fetchWithFallback = async (path: string, params?: Record<string, unknown>) => {
  try {
    const res = await api.get(`${BASE_URL}${path}`, { params });
    return res.data;
  } catch {
    const res = await api.get(`${FALLBACK_URL}${path}`, { params });
    return res.data;
  }
};

export const searchSongs = async (query: string, page: number = 1): Promise<Song[]> => {
  try {
    const data = await fetchWithFallback('/search/songs', { query, page, limit: 20 });
    return data?.data?.results ?? [];
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};

export const getTrendingSongs = async (): Promise<Song[]> => {
  // Search for popular hindi songs as a "trending" feed
  try {
    const data = await fetchWithFallback('/search/songs', {
      query: 'arijit singh top hits',
      page: 1,
      limit: 20,
    });
    return data?.data?.results ?? [];
  } catch (error) {
    console.error('Error getting trending songs:', error);
    return [];
  }
};

export const getSongDetails = async (id: string): Promise<Song | null> => {
  try {
    const data = await fetchWithFallback(`/songs/${id}`);
    return data?.data?.[0] ?? null;
  } catch (error) {
    console.error('Error getting song details:', error);
    return null;
  }
};

export const getSongSuggestions = async (id: string): Promise<Song[]> => {
  try {
    const data = await fetchWithFallback(`/songs/${id}/suggestions`);
    return data?.data ?? [];
  } catch (error) {
    console.error('Error getting song suggestions:', error);
    return [];
  }
};
