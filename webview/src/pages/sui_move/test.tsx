import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";


export default function MoveTest() {
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

  const handleTest = () => {
    setResult(null);
    setError(null);
    window.vscode.postMessage({ command: SuiCommand.MOVE_TEST });
  };

  return (
    <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
      <CardContent className="p-4">
        <BackButton />
        <Button 
          onClick={handleTest}
          variant="outline"
          className="h-16 w-full border-gray-700 bg-gray-800/50 hover:bg-gray-800"
        >
          Test Project
        </Button>
      </CardContent>
    </Card>
  );
}
