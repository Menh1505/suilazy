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
    <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
      <CardContent className="p-4">
        <BackButton />
        <Button
          onClick={handleTest}
          variant="outline"
          className="h-16 w-full border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
        >
          Test Project
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-[var(--vscode-editor-background)]/50 rounded border border-[var(--vscode-editorWidget-border)]">
            <pre className="text-sm text-[var(--vscode-editor-foreground)] whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-[var(--vscode-errorForeground)]/10 rounded border border-[var(--vscode-errorForeground)]">
            <p className="text-sm text-[var(--vscode-errorForeground)]">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
