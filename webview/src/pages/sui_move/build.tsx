"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SuiCommand } from "../../utils/utils";
import type { MoveInitRequest } from "../../types/move/init.type";

// Assuming you have a StatusDialog component similar to the one in the Aptos code
// If not, you'll need to create it
import { StatusDialog } from "../../components/status-dialog";
import { useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple");

  // Basic states
  const [initArgs, setInitArgs] = useState({
    packagePath: "",
    template: "",
    installDir: "",
    defaultMoveFlavor: "",
    defaultMoveEdition: "",
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
        defaultMoveEdition: initArgs.defaultMoveEdition.trim() || undefined,
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

      console.log("Sending data to backend:", data);
    } catch (error) {
      console.error("Error sending data:", error);
      setBuilding(false);
      setCliStatus({ type: "error", message: "Failed to build project" });
      setShowDialog(true);
    }
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
    <div className="mx-auto max-w-2xl">
      <Card className="min-h-screen border-gray-800 bg-gray-900/50">
        <Button
          variant="outline"
          className="h-12 flex items-center justify-center gap-2 hover:bg-gray-700 mt-2 ml-2"
          onClick={() => navigate("/move/help")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Build Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "simple" | "advanced")
            }
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-6">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="packagePath" className="text-white">
                      Package Path (-p, --path)
                    </Label>
                    <p className="text-sm text-gray-400">
                      Path to the package directory
                    </p>
                    <Input
                      id="packagePath"
                      name="packagePath"
                      value={initArgs.packagePath}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installDir" className="text-white">
                      Install Directory (--install-dir)
                    </Label>
                    <p className="text-sm text-gray-400">
                      Directory for compiled artifacts
                    </p>
                    <Input
                      id="installDir"
                      name="installDir"
                      value={initArgs.installDir}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultMoveFlavor" className="text-white">
                      Default Move Flavor (--default-move-flavor)
                    </Label>
                    <p className="text-sm text-gray-400">Default Move flavor</p>
                    <Input
                      id="defaultMoveFlavor"
                      name="defaultMoveFlavor"
                      value={initArgs.defaultMoveFlavor}
                      onChange={handleInputChange}
                      className="text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultMoveEdition" className="text-white">
                      Default Move Edition (--default-move-edition)
                    </Label>
                    <p className="text-sm text-gray-400">
                      Default Move edition
                    </p>
                    <Input
                      id="defaultMoveEdition"
                      name="defaultMoveEdition"
                      value={initArgs.defaultMoveEdition}
                      onChange={handleInputChange}
                      className="text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dev" className="text-white">
                        Dev Mode (-d, --dev)
                      </Label>
                      <Checkbox
                        id="dev"
                        name="dev"
                        checked={initArgs.dev}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            dev: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Enable dev mode</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="test" className="text-white">
                        Test Mode (--test)
                      </Label>
                      <Checkbox
                        id="test"
                        name="test"
                        checked={initArgs.test}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            test: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Enable test mode</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="doc" className="text-white">
                        Generate Docs (--doc)
                      </Label>
                      <Checkbox
                        id="doc"
                        name="doc"
                        checked={initArgs.doc}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            doc: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Generate documentation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="disassemble" className="text-white">
                        Disassemble (--disassemble)
                      </Label>
                      <Checkbox
                        id="disassemble"
                        name="disassemble"
                        checked={initArgs.disassemble}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            disassemble: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Save disassembly</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="force" className="text-white">
                        Force (--force)
                      </Label>
                      <Checkbox
                        id="force"
                        name="force"
                        checked={initArgs.force}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            force: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Force recompilation</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fetchDepsOnly" className="text-white">
                        Fetch Dependencies Only (--fetch-deps-only)
                      </Label>
                      <Checkbox
                        id="fetchDepsOnly"
                        name="fetchDepsOnly"
                        checked={initArgs.fetchDepsOnly}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            fetchDepsOnly: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Fetch dependencies only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="skipFetchLatestGitDeps"
                        className="text-white"
                      >
                        Skip Fetch Latest Git Dependencies
                      </Label>
                      <Checkbox
                        id="skipFetchLatestGitDeps"
                        name="skipFetchLatestGitDeps"
                        checked={initArgs.skipFetchLatestGitDeps}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            skipFetchLatestGitDeps: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Skip latest git deps
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="dependenciesAreRoot"
                        className="text-white"
                      >
                        Dependencies Are Root
                      </Label>
                      <Checkbox
                        id="dependenciesAreRoot"
                        name="dependenciesAreRoot"
                        checked={initArgs.dependenciesAreRoot}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            dependenciesAreRoot: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Treat deps as root</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="silenceWarnings" className="text-white">
                        Silence Warnings
                      </Label>
                      <Checkbox
                        id="silenceWarnings"
                        name="silenceWarnings"
                        checked={initArgs.silenceWarnings}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            silenceWarnings: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Ignore warnings</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="warningsAreErrors" className="text-white">
                        Warnings Are Errors
                      </Label>
                      <Checkbox
                        id="warningsAreErrors"
                        name="warningsAreErrors"
                        checked={initArgs.warningsAreErrors}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            warningsAreErrors: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Treat warnings as errors
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="jsonErrors" className="text-white">
                        JSON Errors
                      </Label>
                      <Checkbox
                        id="jsonErrors"
                        name="jsonErrors"
                        checked={initArgs.jsonErrors}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            jsonErrors: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Emit errors in JSON format
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="noLint" className="text-white">
                        No Lint (--no-lint)
                      </Label>
                      <Checkbox
                        id="noLint"
                        name="noLint"
                        checked={initArgs.noLint}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            noLint: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">Disable linters</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lint" className="text-white">
                        Lint (--lint)
                      </Label>
                      <Checkbox
                        id="lint"
                        name="lint"
                        checked={initArgs.lint}
                        onCheckedChange={(checked) =>
                          setInitArgs((prev) => ({
                            ...prev,
                            lint: checked as boolean,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Enable extra linters
                    </p>
                  </div>
                </div>
              </TabsContent>

              <Button
                type="submit"
                disabled={building}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14"
              >
                {building ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Building Project...</span>
                  </div>
                ) : (
                  "Initialize Project"
                )}
              </Button>
            </form>
          </Tabs>
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
          label: "Go to build",
          onClick: () => navigate("move/publish"),
        }}
      />
    </div>
  );
}
