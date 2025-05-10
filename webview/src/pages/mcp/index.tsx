import { useEffect, useState } from "react";
import { FileEditor } from "../../components/FileEditor";
import { Button } from "../../components/ui/button";
import { SuiCommand } from "../../types/move/command.type";

interface MarkdownFile {
  path: string;
  content: string;
}

export default function MCP() {
  const [isLoading, setIsLoading] = useState(false);
  const [cliStatus, setcliStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showDialog, setShowDialog] = useState(false);
  console.log("showDialog", showDialog, isLoading, cliStatus);

  const [fileList, setFileList] = useState<MarkdownFile[]>([]);

  const handleGetFiles = () => {
    if (!window.vscode) return;
    window.vscode.postMessage({ command: SuiCommand.GET_FILES });
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("check message file", message);
      if (message.type === "cliStatus" && message.message) {
        let finalMessage = message.message;

        if (typeof message.message === "string") {
          const jsonMatch = message.message.match(/{[\s\S]*}$/);
          if (jsonMatch) {
            try {
              finalMessage = JSON.parse(jsonMatch[0]);
            } catch (error) {
              console.error("Không parse được JSON:", error);
            }
          }
        }

        if (typeof finalMessage === "object" && finalMessage.out) {
          finalMessage = finalMessage.out;
        } else if (typeof finalMessage === "object") {
          // Nếu không có thuộc tính .out, chuyển thành chuỗi để đảm bảo an toàn khi render
          finalMessage = JSON.stringify(finalMessage, null, 2);
        }

        setcliStatus({
          type: message.success ? "success" : "error",
          message: finalMessage,
        });

        setIsLoading(false);
        console.log("cliStatus: ", finalMessage);
        setShowDialog(true);
      }

      if (message.type === "cliStatus" && message.files) {
        console.log("check run", message.files);
        setFileList(message.files);
      }
      console.log("check filelist", fileList);
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);
  return (
    <div>
      <Button
        onClick={handleGetFiles}
        variant="outline"
        className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
      >
        Template call AI
      </Button>
      <FileEditor files={fileList} />
    </div>
  );
}
