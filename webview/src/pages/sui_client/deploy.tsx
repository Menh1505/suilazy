import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";
import { ResultDisplay } from "../../components/ui/result-display";

export default function MoveDeploy() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "moveStatus") {
        if (message.status === "success") {
          setResult(message.message);
          setError(null);
        } else {
          setError(message.message);
          setResult(null);
        }
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleDeploy = () => {
    setResult(null);
    setError(null);
    window.vscode.postMessage({ command: SuiCommand.MOVE_PUBLISH });
  };

  const handleUpdate = () => {
    setResult(null);
    setError(null);
    window.vscode.postMessage({ command: SuiCommand.UPDATE_CLI });
  };

  return (
    <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
      <CardContent className="p-4">
        <BackButton />
        <div className="grid gap-4">
          <Button 
            onClick={handleDeploy}
            variant="outline"
            className="h-16 w-full border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            Deploy Project
          </Button>
          <Button 
            onClick={handleUpdate}
            variant="outline"
            className="h-16 w-full border-gray-700 bg-yellow-800/50 hover:bg-yellow-800"
          >
            Update Sui CLI
          </Button>
        </div>
        <ResultDisplay result={result} error={error} />
      </CardContent>
    </Card>
  );
}
