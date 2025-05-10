import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { StatusDialog } from "../../components/status-dialog";

type MoveOptions = {
  dev: boolean;
  test: boolean;
  doc: boolean;
  force: boolean;
  dryRun: boolean;
  devInspect: boolean;
  skipDependencyVerification: boolean;
  withUnpublishedDependencies: boolean;
  json: boolean;
  lint: boolean;
  noLint: boolean;
  silenceWarnings: boolean;
  warningsAreErrors: boolean;
  jsonErrors: boolean;
};

export default function ClientPublish() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [packagePath, setPackagePath] = useState(".");
  const [gasBudget, setGasBudget] = useState("");
  const [gasObjectId, setGasObjectId] = useState("");

  const [options, setOptions] = useState<MoveOptions>({
    dev: false,
    test: false,
    doc: false,
    force: false,
    dryRun: false,
    devInspect: false,
    skipDependencyVerification: false,
    withUnpublishedDependencies: false,
    json: false,
    lint: false,
    noLint: false,
    silenceWarnings: false,
    warningsAreErrors: false,
    jsonErrors: false,
  });

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "moveStatus") {
        setIsLoading(false);
        setDialogOpen(true);
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

  const handlePublish = () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const command = {
      command: SuiCommand.MOVE_PUBLISH,
      options: {
        ...options,
        packagePath,
        gasBudget: gasBudget || undefined,
        gasObjectId: gasObjectId || undefined,
      },
    };

    window.vscode.postMessage(command);
  };

  return (
    <TooltipProvider>
      <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-6">
          <BackButton />

          <div className="mt-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--vscode-editor-foreground)]">
                  Publish Project
                </h1>
                <p className="text-[var(--vscode-editor-foreground)]/70 mt-1">
                  Configure and Publish your Move package
                </p>
              </div>
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                className="bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] px-6"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publish
                  </div>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-[var(--vscode-editor-background)]/50 rounded-lg p-4 border border-[var(--vscode-editorWidget-border)]">
                  <h2 className="text-lg font-medium text-[var(--vscode-editor-foreground)] mb-4">
                    Basic Configuration
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[var(--vscode-editor-foreground)]/70">
                        Package Path
                      </label>
                      <Input
                        value={packagePath}
                        onChange={(e) => setPackagePath(e.target.value)}
                        placeholder="."
                        className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-[var(--vscode-editor-foreground)]/70">
                          Gas Budget
                        </label>
                        <Input
                          value={gasBudget}
                          onChange={(e) => setGasBudget(e.target.value)}
                          type="number"
                          placeholder="Optional"
                          className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-[var(--vscode-editor-foreground)]/70">
                          Gas Object ID
                        </label>
                        <Input
                          value={gasObjectId}
                          onChange={(e) => setGasObjectId(e.target.value)}
                          placeholder="Optional"
                          className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[var(--vscode-editor-background)]/50 rounded-lg p-4 border border-[var(--vscode-editorWidget-border)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-[var(--vscode-editor-foreground)]">
                      Advanced Options
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const resetOptions: MoveOptions = {
                          dev: false,
                          test: false,
                          doc: false,
                          force: false,
                          dryRun: false,
                          devInspect: false,
                          skipDependencyVerification: false,
                          withUnpublishedDependencies: false,
                          json: false,
                          lint: false,
                          noLint: false,
                          silenceWarnings: false,
                          warningsAreErrors: false,
                          jsonErrors: false,
                        };
                        setOptions(resetOptions);
                      }}
                      className="text-[var(--vscode-editor-foreground)]/70 hover:text-[var(--vscode-editor-foreground)]"
                    >
                      Reset All
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {Object.entries(options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-2 rounded transition-colors ${value
                            ? "bg-[var(--vscode-button-background)]/10 border border-[var(--vscode-button-background)]/20"
                            : "hover:bg-[var(--vscode-editor-background)]/30"
                          }`}
                      >
                        <Tooltip>
                          <TooltipTrigger className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${value
                                  ? "bg-[var(--vscode-button-foreground)]"
                                  : "bg-[var(--vscode-editor-foreground)]/50"
                                }`}
                            />
                            <span className="text-sm text-[var(--vscode-editor-foreground)]">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[250px]">
                            <p className="text-sm text-[var(--vscode-editor-foreground)]">
                              {getOptionDescription(key)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            setOptions((prev) => ({ ...prev, [key]: checked }))
                          }
                          className={`${value
                              ? "bg-[var(--vscode-button-background)]"
                              : "bg-[var(--vscode-editorWidget-border)]"
                            }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <StatusDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            loading={isLoading}
            status={{
              type: error ? "error" : "success",
              message: error || result || "",
            }}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function getOptionDescription(key: string): string {
  const descriptions: Record<string, string> = {
    dev: "Compile in 'dev' mode using dev-addresses and dev-dependencies",
    test: "Compile in 'test' mode including test directory code",
    doc: "Generate documentation for packages",
    force: "Force recompilation of all packages",
    dryRun: "Perform a dry run without executing the transaction",
    devInspect: "Perform a dev inspect",
    skipDependencyVerification: "Skip verifying dependency bytecode matches on-chain",
    withUnpublishedDependencies: "Publish unpublished transitive dependencies",
    json: "Output in JSON format",
    lint: "Enable extra linters",
    noLint: "Disable linters",
    silenceWarnings: "Ignore compiler warnings",
    warningsAreErrors: "Treat warnings as errors",
    jsonErrors: "Report errors as JSON",
  };
  return descriptions[key] || "No description available";
}
