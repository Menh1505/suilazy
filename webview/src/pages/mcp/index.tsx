import { useEffect, useState } from "react";
import { FileEditor } from "../../components/FileEditor";
import { Button } from "../../components/ui/button";
import { SuiCommand } from "../../types/move/command.type";
import { StatusDialog } from "../../components/status-dialog";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-vscode-background">
      <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
              >
                Back
              </Button>
            </div>
            <Button
              onClick={handleGetFiles}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Temple call AI MCP
            </Button>
          </div>

          <FileEditor files={fileList} />
        </CardContent>
        <StatusDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          loading={isLoading}
          status={cliStatus}
          loadingTitle="Ai Executing..."
          loadingMessage="Please wait while running command..."
          successTitle="Ai Execution Successful"
          errorTitle="Ai Execution Failed"
        />
      </Card>
    </div>
  );
}
