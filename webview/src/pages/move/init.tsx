import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { MoveInitRequest } from "../../types/move/init.type"; 
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";
import { ResultDisplay } from "../../components/ui/result-display";

export default function MoveInit() {
  const [projectName, setProjectName] = useState("");
  const [result, setResult] = useState<string | null>(null); // State để lưu kết quả
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi (nếu có)

  const handleCreateProject = () => {
    const data: MoveInitRequest = { projectName };
    setResult(null); 
    setError(null); 

    console.log("Sending command to backend:", {
      command: SuiCommand.MOVE_NEW, 
      data,
    });

    window.vscode.postMessage({
      command: SuiCommand.MOVE_NEW, 
      data,
    });
  };

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

  return (
    <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
      <CardContent className="p-4">
        <BackButton />
        <div className="grid gap-4">
          <Input
            placeholder="Project name"
            value={projectName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
          />
          <Button 
            onClick={handleCreateProject}
            variant="outline"
            className="h-16 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            Create Project
          </Button>
        </div>
        <ResultDisplay result={result} error={error} />
      </CardContent>
    </Card>
  );
}
