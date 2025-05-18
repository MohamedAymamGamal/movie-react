import type { MovieSummary } from './index.d';
import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTINS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movieList, setMoviesList] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])
  const fetchMovies = async ( query='') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint =query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTINS);
      
      if (!response.ok) {
        throw new Error('Error fetching movies. Please try again later.');

      }

      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Error fetching movies. Please try again later.');
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results || []);

    } catch (error) {
      console.log(`error fetching movies',${error}`)
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
  fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])
  return (
    <>
      <main>
        <div className='pattern' />

        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
            
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          </header>
          <section className='all-movies'>
            <h2 className='text-gradient mt-[20px]'>All Moive</h2>
            {isLoading ?(
              <p className='text-white'>Loading...</p>
            ): errorMessage ? (
              <p className='text-red'>{errorMessage}</p>
            ):(
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} className='text-white'>{movie.title}</MovieCard>
                  
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

export default App
