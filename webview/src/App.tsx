import icon from "./assets/sui-sui-logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import { vscodeApi } from "./utils/utils";

declare global {
  interface Window {
    vscode: vscodeApi;
  }
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen max-h-screen max-w-screen-xl mx-auto bg-black">
      <Card className="w-full max-h-screen max-w-md border-none">
        <CardHeader className="space-y-2 text-center">
          <div className="flex flex-col items-center">
            <img src={icon} alt="icon" className="w-48 h-48" />
            <CardTitle className="mt-4 font-pacifico text-6xl">
              Sui Lazy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/help")}
          >
            Sui Command
          </Button>

          <div className="flex flex-row justify-center gap-4 mb-2">
            <a
              href="https://docs.sui.io/"
              className="flex-1 h-10 flex items-center justify-center gap-2"
            >
              Sui Documents
            </a>
            <a
              href="https://movelazy-landing-page-six.vercel.app/"
              className="flex-1 h-10 flex items-center justify-center gap-2"
            >
              Sui Lazy Guide
            </a>
          </div>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/mcp")}
          >
            Sui MCP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
