import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Favourite from './pages/Favourite';
import SeatLayout from './pages/SeatLayout';
import MoviesDetails from './pages/MovieDetails';
import MyBookings from './pages/MyBookings';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MoviesDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/movie/:id" element={<MoviesDetails />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favourite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
