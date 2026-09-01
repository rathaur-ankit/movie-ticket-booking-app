import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border md:border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? 'max-md:w-full' : 'max-md:w-0'
        }`}
      >
        <XIcon className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" onClick={() => setIsOpen(false)} />

        <Link onClick={handleLinkClick} to="/">
          Home
        </Link>
        <Link onClick={handleLinkClick} to="/movies">
          Movies
        </Link>
        <Link onClick={handleLinkClick} to="/theatre">
          Theatre
        </Link>
        <Link onClick={handleLinkClick} to="/Release">
          Release
        </Link>
        <Link onClick={handleLinkClick} to="/favorite">
          Favourite
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        <button className="px-4 py-1 sm:px-7 sm:py-2 bg-primary text-[#09090B] font-semibold rounded-full sm:font-medium text-sm sm:text-base cursor-pointer">
          Login
        </button>
      </div>
      <MenuIcon className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
};

export default Navbar;
