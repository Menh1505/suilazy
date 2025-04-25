import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import SuiHelp from './pages/sui_help/index.tsx';
import MoveTest from './pages/sui_move/test.tsx';
// import MoveDeploy from './pages/sui_client/deploy.tsx';
import Network from './pages/network.tsx';
import { RootLayout } from './RootLayout.tsx';
import CliNotFound from './pages/installation/cliNotFound.tsx';
import MoveNew from './pages/sui_move/new.tsx';
import SuiMove from './pages/sui_move/index.tsx';
import MoveHelp from './pages/sui_move/help.tsx';
import MoveDeploy from './pages/sui_client/deploy.tsx';
import MoveBuild from './pages/sui_move/build.tsx';



const router = createMemoryRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "cli-not-found",
        element: <CliNotFound />
      },
      {
        path: "help",
        element: <SuiHelp />
      },
      {
        path: "move",
        element: <SuiMove />,
        children: [
          {
            path: "help",
            element: <MoveHelp />
          },
          {
            path: "new",
            element: <MoveNew />
          },
          {
            path: "build",
            element: <MoveBuild />
          },
          {
            path: "test",
            element: <MoveTest />
          },
          {
            path: "deploy",
            element: <MoveDeploy />
          }
        ]
      },
      {
        path: "network",
        element: <Network />
      }

      // Nếu bạn muốn bật lại Genesis / Network theo kiểu nested
      /*
      {
        path: "Network",
        element: <SuiMove />,
        children: [...]
      },
      {
        path: "Genesis",
        element: <SuiMove />,
        children: [...]
      },
      */
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
