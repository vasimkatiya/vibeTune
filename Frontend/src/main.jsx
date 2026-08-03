import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './Context/SearchContext.jsx'
import { PlayProvider } from './Context/PlaySongContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
      <PlayProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PlayProvider>
    </SearchProvider>
  </StrictMode>,
);
