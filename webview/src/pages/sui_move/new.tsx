"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { SuiCommand } from "../../utils/utils"
import type { MoveInitRequest } from "../../types/move/init.type"

// Assuming you have a StatusDialog component similar to the one in the Aptos code
// If not, you'll need to create it
import { StatusDialog } from "../../components/status-dialog"
import { useNavigate } from "react-router-dom"

export default function MoveNew() {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [cliStatus, setCliStatus] = useState<{ type: "success" | "error"; message: string }>({
    type: "success",
    message: "",
  })
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple")

  // Basic states
  const [initArgs, setInitArgs] = useState({
    name: "",
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
  })

  // Sample templates - replace with actual Sui Move templates
  const templates = ["counter", "hello_world", "fungible_tokens", "nft", "defi"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setInitArgs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleTemplateChange = (value: string) => {
    setInitArgs((prev) => ({
      ...prev,
      template: value,
    }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initArgs.name.trim()) {
      setCliStatus({
        type: "error",
        message: "Project name is required",
      });
      setShowDialog(true);
      return;
    }

    setInitializing(true);

    const data: MoveInitRequest = {
      projectName: initArgs.name.trim(),
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
        command: SuiCommand.MOVE_NEW,
        data,
      });

      console.log("Sending data to backend:", data);
    } catch (error) {
      console.error("Error sending data:", error);
      setInitializing(false);
      setCliStatus({ type: "error", message: "Failed to initialize project" });
      setShowDialog(true);
    }
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data
      if (message.type === "moveStatus") {
        setCliStatus({
          type: message.status === "success" ? "success" : "error",
          message: message.message || "",
        })
        setInitializing(false)
        setShowDialog(true)
      }
    }

    window.addEventListener("message", messageHandler)
    return () => window.removeEventListener("message", messageHandler)
  }, [])

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
          <CardTitle className="text-2xl font-bold text-white">Init Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "simple" | "advanced")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="simple" className="data-[state=active]:bg-gray-700">
                Simple
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-gray-700">
                Advanced
              </TabsTrigger>
            </TabsList>

            <div className="space-y-2 mt-6">
              <Label htmlFor="name" className="text-white">
                Name (required)
              </Label>
              <Input
                id="name"
                name="name"
                value={initArgs.name}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <TabsContent value="simple">
                <div className="space-y-2">
                  <Label htmlFor="template" className="text-white">
                    Template (Optional)
                  </Label>
                  <Select onValueChange={handleTemplateChange} value={initArgs.template}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="[Please select a template]" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {templates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template" className="text-white">
                      Template
                    </Label>
                    <Select onValueChange={handleTemplateChange} value={initArgs.template}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="[Please select a template]" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {templates.map((template) => (
                          <SelectItem key={template} value={template}>
                            {template}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packagePath" className="text-white">
                      Package Path (-p, --path)
                    </Label>
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
                    <Input
                      id="defaultMoveFlavor"
                      name="defaultMoveFlavor"
                      value={initArgs.defaultMoveFlavor}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultMoveEdition" className="text-white">
                      Default Move Edition (--default-move-edition)
                    </Label>
                    <Input
                      id="defaultMoveEdition"
                      name="defaultMoveEdition"
                      value={initArgs.defaultMoveEdition}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dev"
                      name="dev"
                      checked={initArgs.dev}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, dev: checked as boolean }))}
                    />
                    <Label htmlFor="dev" className="text-white">
                      Dev Mode (-d, --dev)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="test"
                      name="test"
                      checked={initArgs.test}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, test: checked as boolean }))}
                    />
                    <Label htmlFor="test" className="text-white">
                      Test Mode (--test)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="doc"
                      name="doc"
                      checked={initArgs.doc}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, doc: checked as boolean }))}
                    />
                    <Label htmlFor="doc" className="text-white">
                      Generate Docs (--doc)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="disassemble"
                      name="disassemble"
                      checked={initArgs.disassemble}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, disassemble: checked as boolean }))
                      }
                    />
                    <Label htmlFor="disassemble" className="text-white">
                      Disassemble (--disassemble)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="force"
                      name="force"
                      checked={initArgs.force}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, force: checked as boolean }))}
                    />
                    <Label htmlFor="force" className="text-white">
                      Force (--force)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fetchDepsOnly"
                      name="fetchDepsOnly"
                      checked={initArgs.fetchDepsOnly}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, fetchDepsOnly: checked as boolean }))
                      }
                    />
                    <Label htmlFor="fetchDepsOnly" className="text-white">
                      Fetch Dependencies Only (--fetch-deps-only)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipFetchLatestGitDeps"
                      name="skipFetchLatestGitDeps"
                      checked={initArgs.skipFetchLatestGitDeps}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, skipFetchLatestGitDeps: checked as boolean }))
                      }
                    />
                    <Label htmlFor="skipFetchLatestGitDeps" className="text-white">
                      Skip Fetch Latest Git Dependencies
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dependenciesAreRoot"
                      name="dependenciesAreRoot"
                      checked={initArgs.dependenciesAreRoot}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, dependenciesAreRoot: checked as boolean }))
                      }
                    />
                    <Label htmlFor="dependenciesAreRoot" className="text-white">
                      Dependencies Are Root
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="silenceWarnings"
                      name="silenceWarnings"
                      checked={initArgs.silenceWarnings}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, silenceWarnings: checked as boolean }))
                      }
                    />
                    <Label htmlFor="silenceWarnings" className="text-white">
                      Silence Warnings
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="warningsAreErrors"
                      name="warningsAreErrors"
                      checked={initArgs.warningsAreErrors}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, warningsAreErrors: checked as boolean }))
                      }
                    />
                    <Label htmlFor="warningsAreErrors" className="text-white">
                      Warnings Are Errors
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="jsonErrors"
                      name="jsonErrors"
                      checked={initArgs.jsonErrors}
                      onCheckedChange={(checked) =>
                        setInitArgs((prev) => ({ ...prev, jsonErrors: checked as boolean }))
                      }
                    />
                    <Label htmlFor="jsonErrors" className="text-white">
                      JSON Errors
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noLint"
                      name="noLint"
                      checked={initArgs.noLint}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, noLint: checked as boolean }))}
                    />
                    <Label htmlFor="noLint" className="text-white">
                      No Lint (--no-lint)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lint"
                      name="lint"
                      checked={initArgs.lint}
                      onCheckedChange={(checked) => setInitArgs((prev) => ({ ...prev, lint: checked as boolean }))}
                    />
                    <Label htmlFor="lint" className="text-white">
                      Lint (--lint)
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <Button
                type="submit"
                disabled={initializing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14"
              >
                {initializing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Initializing Project...</span>
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
        loading={initializing}
        status={cliStatus}
        loadingTitle="Initializing..."
        loadingMessage="Please wait while initializing project..."
        successTitle="Initialization Successful"
        errorTitle="Initialization Failed"
        successAction={{
          label: "Go to build",
          onClick: () => navigate("/move/build"),
        }}
      />
    </div>
  )
}
