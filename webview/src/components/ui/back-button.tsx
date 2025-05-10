import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="h-12 flex items-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)] hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
      >
        Back
      </Button>
    </div>
  );
}
