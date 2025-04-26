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

// Add this type definition near the top of the file
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
  
  
  // Basic options
  const [packagePath, setPackagePath] = useState(".");
  const [gasBudget, setGasBudget] = useState("");
  const [gasObjectId, setGasObjectId] = useState("");

  // Advanced options
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
      <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
        <CardContent className="p-6">
          <BackButton />

          {/* Project Configuration Section */}
          <div className="mt-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Publish Project
                </h1>
                <p className="text-gray-400 mt-1">Configure and Publish your Move package</p>
              </div>
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6"
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Settings */}
              <div className="space-y-6">
                <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700">
                  <h2 className="text-lg font-medium mb-4">Basic Configuration</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Package Path</label>
                      <Input
                        value={packagePath}
                        onChange={(e) => setPackagePath(e.target.value)}
                        placeholder="."
                        className="bg-gray-900/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Gas Budget</label>
                        <Input
                          value={gasBudget}
                          onChange={(e) => setGasBudget(e.target.value)}
                          type="number"
                          placeholder="Optional"
                          className="bg-gray-900/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Gas Object ID</label>
                        <Input
                          value={gasObjectId}
                          onChange={(e) => setGasObjectId(e.target.value)}
                          placeholder="Optional"
                          className="bg-gray-900/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Advanced Options */}
              <div className="space-y-6">
                <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Advanced Options</h2>
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
                      className="text-gray-400 hover:text-white"
                    >
                      Reset All
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {Object.entries(options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-2 rounded transition-colors ${
                          value ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-gray-700/30"
                        }`}
                      >
                        <Tooltip>
                          <TooltipTrigger className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                value ? "bg-blue-400" : "bg-gray-500"
                              }`}
                            />
                            <span className="text-sm">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[250px]">
                            <p className="text-sm">{getOptionDescription(key)}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            setOptions((prev) => ({ ...prev, [key]: checked }))
                          }
                          className={value ? "bg-blue-600" : "bg-gray-600"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <StatusDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            loading={isLoading}
            status={{
              type: error ? "error" : "success",
              message: error || result || ""
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
