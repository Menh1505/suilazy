import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import SuiHelp from "./pages/sui_help/index.tsx";
import MoveTest from "./pages/sui_move/test.tsx";
// import MoveDeploy from './pages/sui_client/deploy.tsx';
import { RootLayout } from "./RootLayout.tsx";
import CliNotFound from "./pages/installation/cliNotFound.tsx";
import MoveNew from "./pages/sui_move/new.tsx";
import SuiMove from "./pages/sui_move/index.tsx";
import MoveHelp from "./pages/sui_move/help.tsx";
import MoveBuild from "./pages/sui_move/build.tsx";
import SuiClient from "./pages/sui_client/index.tsx";
import ClientNetwork from "./pages/sui_client/network.tsx";
import ClientHelp from "./pages/sui_client/help.tsx";
import ClientPublish from "./pages/sui_client/publish.tsx";
import MCP from "./pages/mcp/index.tsx";

const router = createMemoryRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "cli-not-found",
        element: <CliNotFound />,
      },
      {
        path: "help",
        element: <SuiHelp />,
      },
      {
        path: "mcp",
        element: <MCP />,
      },
      {
        path: "move",
        element: <SuiMove />,
        children: [
          {
            path: "help",
            element: <MoveHelp />,
          },
          {
            path: "new",
            element: <MoveNew />,
          },
          {
            path: "build",
            element: <MoveBuild />,
          },
          {
            path: "test",
            element: <MoveTest />,
          },
        ],
      },

      {
        path: "client",
        element: <SuiClient />,
        children: [
          {
            path: "help",
            element: <ClientHelp />,
          },
          {
            path: "publish",
            element: <ClientPublish />,
          },
          {
            path: "network",
            element: <ClientNetwork />,
          },
        ],
      },

      // Nếu bạn muốn bật lại Genesis / Network theo kiểu nested
      /*
      {
        path: "publish",
        element: <ClientPublish />
      }
      // {
      //   path: "Genesis",
      //   element: <SuiMove />,
      //   children: [...]
      // },
      // */
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
