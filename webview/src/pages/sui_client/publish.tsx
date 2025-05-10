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
import { MoveInitRequest } from "../../types/move/init.type";

export default function ClientPublish() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [initArgs, setInitArgs] = useState({
    packagePath: "",
    installDir: "",
    defaultMoveFlavor: "",
    defaultMoveEdition: "",
    gasBudget: "",
    gas: "",
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
    dryRun: false,
    devInspect: false,
    skipDependencyVerification: false,
    withUnpublishedDependencies: false,
    json: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInitArgs((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("Received message:", message);
      if (message.type === "moveStatus") {
        setIsLoading(false);
        setDialogOpen(true);
        if (message.status === "success") {
          console.log("Success response:", message.message);
          setResult(message.message);
          setError(null);
        } else {
          console.log("Error response:", message.message);
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
        defaultMoveEdition: initArgs.defaultMoveEdition.trim() || undefined,
        dependenciesAreRoot: initArgs.dependenciesAreRoot,
        silenceWarnings: initArgs.silenceWarnings,
        warningsAreErrors: initArgs.warningsAreErrors,
        jsonErrors: initArgs.jsonErrors,
        noLint: initArgs.noLint,
        lint: initArgs.lint,
        gas: initArgs.gas.trim() || undefined,
        gasBudget: initArgs.gasBudget.trim() || undefined,
        dryRun: initArgs.dryRun,
        devInspect: initArgs.devInspect,
        skipDependencyVerification: initArgs.skipDependencyVerification,
        withUnpublishedDependencies: initArgs.withUnpublishedDependencies,
        json: initArgs.json,
      },
    };

    console.log("Sending publish command:", data);

    try {
      window.vscode.postMessage({
        command: SuiCommand.MOVE_PUBLISH,
        data,
      });
    } catch (error) {
      console.error("Error sending data:", error);
      setIsLoading(false);
      setError("Failed to send publish request");
      setDialogOpen(true);
    }
  };

  const resetOptions = () => {
    setInitArgs({
      packagePath: ".",
      installDir: "",
      defaultMoveFlavor: "",
      defaultMoveEdition: "",
      gasBudget: "",
      gas: "",
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
      dryRun: false,
      devInspect: false,
      skipDependencyVerification: false,
      withUnpublishedDependencies: false,
      json: false,
    });
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
                    Publishing
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
                          Gas Budget
                        </label>
                        <Input
                          name="gasBudget"
                          value={initArgs.gasBudget}
                          onChange={handleInputChange}
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
                          name="gas"
                          value={initArgs.gas}
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
                    {Object.entries(initArgs)
                      .filter(
                        ([key]) =>
                          typeof initArgs[key as keyof typeof initArgs] ===
                          "boolean"
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center justify-between p-2 rounded transition-colors ${
                            value
                              ? "bg-[var(--vscode-button-background)]/10 border border-[var(--vscode-button-background)]/20"
                              : "hover:bg-[var(--vscode-editor-background)]/30"
                          }`}
                        >
                          <Tooltip>
                            <TooltipTrigger className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  value
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
                            <TooltipContent
                              side="left"
                              className="max-w-[250px]"
                            >
                              <p className="text-sm text-[var(--vscode-editor-foreground)]">
                                {getOptionDescription(key)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Switch
                            checked={Boolean(value)}
                            onCheckedChange={(checked) =>
                              setInitArgs((prev) => ({
                                ...prev,
                                [key]: checked,
                              }))
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

          <StatusDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            loading={isLoading}
            status={{
              type: error ? "error" : "success",
              message: error || result || "",
            }}
            loadingTitle="Publishing..."
            loadingMessage="Please wait while publishing project..."
            successTitle="Publish Successful"
            errorTitle="Publish Failed"
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
    disassemble: "Save disassembly for generated bytecode",
    force: "Force recompilation of all packages",
    fetchDepsOnly: "Only fetch dependency repos to MOVE_HOME",
    skipFetchLatestGitDeps: "Skip fetching latest git dependencies",
    dependenciesAreRoot: "Treat dependencies as root packages",
    silenceWarnings: "Ignore compiler warnings",
    warningsAreErrors: "Treat warnings as errors",
    jsonErrors: "Report errors as JSON",
    noLint: "Disable linters",
    lint: "Enable extra linters",
    dryRun: "Perform a dry run without executing the transaction",
    devInspect: "Perform a dev inspect",
    skipDependencyVerification:
      "Skip verifying dependency bytecode matches on-chain",
    withUnpublishedDependencies: "Publish unpublished transitive dependencies",
    json: "Output in JSON format",
  };
  return descriptions[key] || "No description available";
}
