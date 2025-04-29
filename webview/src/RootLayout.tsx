import { Outlet } from "react-router-dom";
// import { PathTracker } from "./PathTracker";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-vscode-background">
      <main>
        <Outlet />
        {/* <PathTracker /> */}
      </main>
    </div>
  );
};
