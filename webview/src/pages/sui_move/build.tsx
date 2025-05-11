import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MoveInitRequest } from "../../types/move/init.type";
import { SuiCommand } from "../../utils/utils";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../components/ui/tooltip";
import { BackButton } from "../../components/ui/back-button";
import { Loader2 } from "lucide-react";
import { StatusDialog } from "../../components/status-dialog";

export default function MoveBuild() {
  const navigate = useNavigate();
  const [building, setBuilding] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cliStatus, setCliStatus] = useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "",
  });

  const [initArgs, setInitArgs] = useState({
    packagePath: "",
    installDir: "",
    defaultMoveFlavor: "",
    dev: false,
    test: false,
    doc: false,
    disassemble: false,
    force: false,
    fetchDepsOnly: false,
    skipFetchLatestGitDeps: false,
    dependenciesAreRoot: false,
    silenceWarnings: false,
    warningsAreErrors: false,
    jsonErrors: false,
    noLint: false,
    lint: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInitArgs((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuilding(true);

    const data: MoveInitRequest = {
      packagePath: initArgs.packagePath.trim() || undefined,
      options: {
        dev: initArgs.dev,
        test: initArgs.test,
        doc: initArgs.doc,
        disassemble: initArgs.disassemble,
        installDir: initArgs.installDir.trim() || undefined,
        force: initArgs.force,
        fetchDepsOnly: initArgs.fetchDepsOnly,
        skipFetchLatestGitDeps: initArgs.skipFetchLatestGitDeps,
        defaultMoveFlavor: initArgs.defaultMoveFlavor.trim() || undefined,
        dependenciesAreRoot: initArgs.dependenciesAreRoot,
        silenceWarnings: initArgs.silenceWarnings,
        warningsAreErrors: initArgs.warningsAreErrors,
        jsonErrors: initArgs.jsonErrors,
        noLint: initArgs.noLint,
        lint: initArgs.lint,
      },
    };

    try {
      window.vscode.postMessage({
        command: SuiCommand.MOVE_BUILD,
        data,
      });
    } catch (error) {
      console.error("Error sending data:", error);
      setBuilding(false);
      setCliStatus({ type: "error", message: "Failed to build project" });
      setShowDialog(true);
    }
  };

  const resetOptions = () => {
    setInitArgs({
      packagePath: "",
      installDir: "",
      defaultMoveFlavor: "",
      dev: false,
      test: false,
      doc: false,
      disassemble: false,
      force: false,
      fetchDepsOnly: false,
      skipFetchLatestGitDeps: false,
      dependenciesAreRoot: false,
      silenceWarnings: false,
      warningsAreErrors: false,
      jsonErrors: false,
      noLint: false,
      lint: false,
    });
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "moveStatus") {
        setCliStatus({
          type: message.status === "success" ? "success" : "error",
          message: message.message || "",
        });
        setBuilding(false);
        setShowDialog(true);
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return (
    <TooltipProvider>
      <Card className="w-full min-h-screen border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-6">
          <BackButton />

          <div className="mt-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--vscode-editor-foreground)]">
                  Build Project
                </h1>
                <p className="text-[var(--vscode-editor-foreground)]/70 mt-1">
                  Configure and build your Move package
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={building}
                className="bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] px-6"
              >
                {building ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building
                  </div>
                ) : (
                  "Build"
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
                        name="packagePath"
                        value={initArgs.packagePath}
                        onChange={handleInputChange}
                        placeholder="."
                        className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-[var(--vscode-editor-foreground)]/70">
                          Install Directory
                        </label>
                        <Input
                          name="installDir"
                          value={initArgs.installDir}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-[var(--vscode-editor-foreground)]/70">
                          Default Move Flavor
                        </label>
                        <Input
                          name="defaultMoveFlavor"
                          value={initArgs.defaultMoveFlavor}
                          onChange={handleInputChange}
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
                      onClick={resetOptions}
                      className="text-[var(--vscode-editor-foreground)]/70 hover:text-[var(--vscode-editor-foreground)]"
                    >
                      Reset All
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {Object.entries(initArgs).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-2 rounded transition-colors ${
                          value
                            ? "bg-blue-600/10 border border-blue-500/20"
                            : "hover:bg-gray-700/30"
                        }`}
                      >
                        <Tooltip>
                          <TooltipTrigger className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                value ? "bg-blue-400" : "bg-gray-500"
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
                          checked={Boolean(value)}
                          onCheckedChange={(checked) =>
                            setInitArgs((prev) => ({ ...prev, [key]: checked }))
                          }
                          className={`${
                            value
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

          <div className="mt-6">
            {cliStatus.message && (
              <div
                className={`p-4 rounded-lg ${
                  cliStatus.type === "success"
                    ? "bg-green-900/20 border border-green-800"
                    : "bg-red-900/20 border border-red-800"
                }`}
              >
                <p className="text-sm text-[var(--vscode-editor-foreground)]">
                  {cliStatus.type === "success" ? "✅ " : "❌ "}
                  {cliStatus.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <StatusDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        loading={building}
        status={cliStatus}
        loadingTitle="Building..."
        loadingMessage="Please wait while Building project..."
        successTitle="Building Successful"
        errorTitle="Build Failed"
        successAction={{
          label: "Go to Publish",
          onClick: () => navigate("/client/publish"),
        }}
      />
    </TooltipProvider>
  );
}

const getOptionDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    dev: "Enable dev mode for development purposes.",
    test: "Enable test mode to run tests.",
    doc: "Generate documentation for the project.",
    disassemble: "Save disassembly of the compiled code.",
    force: "Force recompilation even if no changes are detected.",
    fetchDepsOnly: "Fetch dependencies only without building.",
    skipFetchLatestGitDeps: "Skip fetching the latest git dependencies.",
    dependenciesAreRoot: "Treat dependencies as root packages.",
    silenceWarnings: "Ignore all warnings during the build process.",
    warningsAreErrors: "Treat warnings as errors.",
    jsonErrors: "Emit errors in JSON format.",
    noLint: "Disable linters during the build process.",
    lint: "Enable extra linters during the build process.",
  };
  return descriptions[key] || "No description available.";
};
