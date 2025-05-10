"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useEffect, useState } from "react";
import { Loading } from "../../components/ui/loading";
import { SuiCommand } from "../../utils/utils";

export default function SuiHelp() {
  const navigate = useNavigate();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    window.vscode.postMessage({ command: SuiCommand.VERSION });
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "cliStatus") {
        if (message.status === "error") {
          console.error(message.message);
          navigate("/cli-not-found");
        } else if (message.status === "success" && message.message.version) {
          setVersion(message.message.version);
        }
      }
    };
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, [version]);

  return (
    <div className="min-h-screen bg-vscode-background">
      <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Start
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/client")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Client
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/move")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Move
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              version: {version ? version : <Loading size="small" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}