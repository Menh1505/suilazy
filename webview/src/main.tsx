import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import SuiHelp from './pages/help.tsx';
import CliNotFound from './pages/cliNotFound.tsx';

const router = createMemoryRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'cli-not-found',
    element: <CliNotFound />
  },
  {
    path: 'help',
    element: <SuiHelp />
  },
  {
    path: 'move',
    element: ""
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
