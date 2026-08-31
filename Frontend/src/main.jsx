import { BrowserRouter } from 'react-router-dom';
import App from './src/App';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
