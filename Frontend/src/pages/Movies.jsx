import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const Movies = () => {
  const { shows } = useAppContext();

  return shows.length > 0 ? (
    <div className="relative pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden min-h-[80vh] isolate">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium text-gray-300 my-4">Now Showing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[70vh] pt-24">
      <h1 className="text-3xl font-bold text-center">No movies available</h1>
    </div>
  );
};

export default Movies;
