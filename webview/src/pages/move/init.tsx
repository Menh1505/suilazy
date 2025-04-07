import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { MoveInitRequest } from "../../types/move/init.type"; 
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";

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

    // Lắng nghe phản hồi từ backend
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("Received message from backend:", message);

      if (message.type === "moveStatus") {
        if (message.status === "success") {
          console.log("Success message received:", message.message);
          setResult(message.message); // Lưu kết quả thành công
        } else if (message.status === "error") {
          console.error("Error message received:", message.message);
          setError(message.message); // Lưu lỗi nếu có
        }
      }
    };

    window.addEventListener("message", messageHandler);

    // Cleanup listener khi component bị unmount
    return () => {
      console.log("Cleaning up message listener");
      window.removeEventListener("message", messageHandler);
    };
  };

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

        {/* Hiển thị kết quả */}
        {result && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
            <strong>Success:</strong> {result}
          </div>
        )}

        {/* Hiển thị lỗi */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
