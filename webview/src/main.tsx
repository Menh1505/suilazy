import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import SuiHelp from './pages/help.tsx';
import CliNotFound from './pages/cliNotFound.tsx';
import SuiMove from './pages/move.tsx';
import MoveInit from './pages/move/init';
import MoveBuild from './pages/move/build';
import MoveTest from './pages/move/test';
import MoveDeploy from './pages/move/deploy';
import Network from './pages/network.tsx';

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
    element: <SuiMove />
  },
  {
    path: 'move/init', 
    element: <MoveInit />
  },
  {
    path: 'move/build', 
    element: <MoveBuild />
  },
  {
    path: 'move/deploy', 
    element: <MoveDeploy />
  },
  {
    path: 'move/test', 
    element: <MoveTest />
  },
  {
    path: 'network', 
    element: <Network />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
