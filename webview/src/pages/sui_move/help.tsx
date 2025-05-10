import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function MoveHelp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]">
      <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/help")}
              variant="outline"
              className="h-14 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Back
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/move/new")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Move New
            </Button>

            <Button
              onClick={() => navigate("/move/build")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Move Build
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/move/test")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
            >
              Move Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
