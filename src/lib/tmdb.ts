import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// For demo purposes - in production, this should be in environment variables
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63'; // This is a public demo key

export interface TMDBMovie {
  id: number;
  title: string;
  name?: string; // For TV series
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string; // For TV series
  vote_average: number;
  media_type?: 'movie' | 'tv';
  genre_ids: number[];
}

export interface SearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

class TMDBService {
  private apiKey: string;

  constructor() {
    this.apiKey = TMDB_API_KEY;
  }

  // Get poster URL with different sizes
  getPosterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!posterPath) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
  }

  // Get backdrop URL
  getBackdropUrl(backdropPath: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!backdropPath) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`;
  }

  // Search for movies and TV shows
  async searchMulti(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: this.apiKey,
          query: query.trim(),
          page,
          include_adult: false,
        },
      });
      
      // Filter out person results and only keep movies/tv shows
      const filteredResults = response.data.results.filter(
        (item: TMDBMovie) => item.media_type === 'movie' || item.media_type === 'tv'
      );

      return {
        ...response.data,
        results: filteredResults,
      };
    } catch (error) {
      console.error('Error searching TMDB:', error);
      throw new Error('Failed to search movies and TV shows');
    }
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
        },
      });
      return { ...response.data, media_type: 'movie' };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  // Get TV show details
  async getTVDetails(tvId: number): Promise<TMDBMovie> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: this.apiKey,
        },
      });
      return { ...response.data, media_type: 'tv' };
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw new Error('Failed to fetch TV show details');
    }
  }

  // Get trending movies and TV shows
  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}`, {
        params: {
          api_key: this.apiKey,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw new Error('Failed to fetch trending content');
    }
  }
}

export const tmdbService = new TMDBService();
