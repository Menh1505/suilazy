import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function ClientHelp() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-vscode-background">
            <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <Button
                            onClick={() => navigate("/help")}
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
                        >
                            Back
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <Button
                            onClick={() => navigate("/client/network")}
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
                        >
                            Network
                        </Button>

                        <Button
                            onClick={() => navigate("/client/publish")}
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center gap-2 border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50 hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
                        >
                            Publish
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
