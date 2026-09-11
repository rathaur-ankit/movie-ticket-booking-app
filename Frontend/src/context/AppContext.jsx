import { createContext,useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin,setIsAdmin]=useState(false);
    const [shows,setShows]=useState([]);
    const [favoriteMovies,setFavoriteMovies]=useState([]);

     const {user}=useUser();
     const {getToken}=useAuth()
     const location=useLocation();
     const navigate=useNavigate()

    const fetchIsAdmin=async (req,res) => {
        try {
         const {data}=await axios.get('/api/v1/admin/is-admin',{headers:{Authorization:`Bearer ${await getToken()}`}})
         setIsAdmin(data.isAdmin);

         if(!data.isAdmin && location.pathname.startsWith('/admin')){
            navigate('/');
            toast.error("You are not authorized to access admin dashboard");
         }
        } catch (error) {
          console.error(error);
        }
    }
    
    const fetchShows=async () => {
        try {
            const {data}=await axios.get("/api/v1/show/all");
            if(data.success)
            setShows(data.shows);
           else
             toast.error(data.message);
        } catch (error) {
           console.error(error); 
        }
    }

    const fetchFavouriteMovies=async () => {
        try {
           const {data}=await axios.get('/api/v1/user/favourites',{
            headers:{Authorization:`Bearer ${await getToken()}`}
           }) 
         if(data.success)
          setFavoriteMovies(data.movies);
        else
           toast.error(data.message);
        } catch (error) {
           console.error(error);
            
        }
    }
   
    useEffect(()=>{
        fetchShows();
    },[]);

   useEffect(()=>{
    if(user){
        fetchIsAdmin();
        fetchFavouriteMovies();
    }
   },[user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,shows,favoriteMovies,fetchFavouriteMovies
  };

  return 
   (<AppContext.Provider value={value}>
    {children}
    </AppContext.Provider>)
};

export const useAppContext = () => useContext(AppContext);
