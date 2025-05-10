import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { SuiCommand } from "../../utils/utils";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { StatusDialog } from "../../components/status-dialog";

const NETWORK_INFO = {
  devnet: {
    url: "https://fullnode.devnet.sui.io:443",
    description: "Deployed every week on Mondays",
  },
  testnet: {
    url: "https://fullnode.testnet.sui.io:443",
    description: "Deployed every week on Tuesdays",
  },
  mainnet: {
    url: "https://fullnode.mainnet.sui.io:443",
    description: "Deployed every two weeks on Wednesdays",
  },
};

export default function NetworkManager() {
  const [environments, setEnvironments] = React.useState<
    Array<{
      alias: string;
      url: string;
      active: boolean;
    }>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [newEnv, setNewEnv] = React.useState({ alias: "", url: "" });
  const [activeTab, setActiveTab] = React.useState<"switch" | "custom">(
    "switch"
  );
  console.log("activeTab", activeTab);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);

  const [status, setStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  const fetchEnvironments = React.useCallback(() => {
    console.log("Fetching environments...");
    setLoading(true);
    window.vscode.postMessage({ command: SuiCommand.CLIENT_ENVS });
  }, []);

  const handleSwitchEnv = React.useCallback(
    (env: string) => {
      console.log("Switching to environment:", env);
      setLoading(true);
      window.vscode.postMessage({
        command: SuiCommand.CLIENT_SWITCH,
        data: { env },
      });

      const messageHandler = (event: MessageEvent) => {
        const message = event.data;
        console.log("Received message from vscode:", message);
        if (message.type === "moveStatus" && message.status === "success") {
          console.log("Environment switched successfully");
          fetchEnvironments();
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);
    },
    [fetchEnvironments]
  );

  const handleAddEnv = React.useCallback(() => {
    console.log("Adding new environment:", newEnv);
    if (!newEnv.alias || !newEnv.url) {
      console.error("Error: Alias and RPC URL are required");
      setError("Please provide both alias and RPC URL");
      return;
    }
    setLoading(true);
    window.vscode.postMessage({
      command: SuiCommand.CLIENT_NEW_ENV,
      data: {
        alias: newEnv.alias,
        rpc: newEnv.url,
      },
    });

    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("Received message from vscode:", message);

      if (message.type === "moveStatus") {
        if (message.status === "success") {
          console.log("Environment added successfully");
          setStatus({
            type: "success",
            message: message.message,
          });
          setStatusDialogOpen(true);
          fetchEnvironments();
        } else if (message.status === "error") {
          console.error("Error adding environment:", message.message);
          setError(message.message);
          setStatus({
            type: "error",
            message: message.message,
          });
          setStatusDialogOpen(true);
        }
        setLoading(false);
        window.removeEventListener("message", messageHandler);
      }
    };

    window.addEventListener("message", messageHandler);
  }, [newEnv, fetchEnvironments]);

  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("Received message from vscode:", message);
      setLoading(false);

      if (message.type === "error") {
        console.error("Error:", message.message);
        setError(message.message);
        setStatus({ type: "error", message: message.message });
        setStatusDialogOpen(true);
        return;
      }

      setError(null);

      if (message.type === "moveStatus" && message.status === "success") {
        const { environments } = message.data;
        console.log("Environments data received:", environments);

        const processedEnvs = environments
          .filter((env: { alias: string }) => {
            return (
              env.alias.startsWith("│") &&
              !env.alias.includes("├") &&
              !env.alias.includes("╰") &&
              !env.alias.includes("alias")
            );
          })
          .map((env: { alias: string }) => {
            const parts = env.alias.split("│").map((part) => part.trim());
            return {
              alias: parts[1],
              url: parts[2],
              active: parts[3] === "*",
            };
          });

        console.log("Processed environments:", processedEnvs);
        setEnvironments(processedEnvs);
        setStatus({
          type: "success",
          message: message.message,
        });
        setStatusDialogOpen(true);
      }
    };

    console.log("Adding message event listener");
    window.addEventListener("message", messageHandler);
    fetchEnvironments();

    return () => {
      console.log("Removing message event listener");
      window.removeEventListener("message", messageHandler);
    };
  }, [fetchEnvironments]);

  return (
    <div className="min-h-screen bg-vscode-background p-4">
      <Card className="w-full border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--vscode-editor-foreground)]">
              Network Configuration
            </h2>
            <Button
              variant="outline"
              className="border-[var(--vscode-editorWidget-border)] hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-[var(--vscode-errorForeground)]/10 border border-[var(--vscode-errorForeground)] rounded-lg text-[var(--vscode-errorForeground)]">
                {error}
              </div>
            )}

            <Tabs defaultValue="switch" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="switch"
                  onClick={() => setActiveTab("switch")}
                  className="text-[var(--vscode-editor-foreground)]"
                >
                  Switch Network
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  onClick={() => setActiveTab("custom")}
                  className="text-[var(--vscode-editor-foreground)]"
                >
                  Add Custom
                </TabsTrigger>
              </TabsList>

              <TabsContent value="switch">
                <div className="bg-[var(--vscode-editor-background)]/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[var(--vscode-editor-foreground)]">
                      Active Environments
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={fetchEnvironments}
                      disabled={loading}
                      className="h-8 w-8 text-[var(--vscode-editor-foreground)] hover:text-[var(--vscode-button-foreground)]"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {environments.map((env) => (
                      <div
                        key={env.alias}
                        className={`p-4 rounded-lg border transition-colors ${
                          env.active
                            ? "border-[var(--vscode-focusBorder)] bg-[var(--vscode-focusBorder)]/10"
                            : "border-[var(--vscode-editorWidget-border)] hover:border-[var(--vscode-focusBorder)]"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium text-[var(--vscode-editor-foreground)]">
                              {env.alias}
                            </p>
                            <p className="text-sm text-[var(--vscode-editor-foreground)]/70">
                              {env.url}
                            </p>
                            {NETWORK_INFO[
                              env.alias as keyof typeof NETWORK_INFO
                            ]?.description && (
                              <p className="text-xs text-[var(--vscode-editor-foreground)]/50">
                                {
                                  NETWORK_INFO[
                                    env.alias as keyof typeof NETWORK_INFO
                                  ].description
                                }
                              </p>
                            )}
                          </div>
                          {!env.active && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSwitchEnv(env.alias)}
                              disabled={loading}
                              className="border-[var(--vscode-editorWidget-border)]"
                            >
                              Switch
                            </Button>
                          )}
                          {env.active && (
                            <div className="text-[var(--vscode-focusBorder)]">
                              Active
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="bg-[var(--vscode-editor-background)]/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--vscode-editor-foreground)] mb-4">
                    Add New Environment
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="alias"
                        className="text-[var(--vscode-editor-foreground)]"
                      >
                        Network Alias
                      </Label>
                      <Input
                        id="alias"
                        value={newEnv.alias}
                        onChange={(e) =>
                          setNewEnv((prev) => ({
                            ...prev,
                            alias: e.target.value,
                          }))
                        }
                        placeholder="e.g., localnet"
                        className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="url"
                        className="text-[var(--vscode-editor-foreground)]"
                      >
                        RPC URL
                      </Label>
                      <Input
                        id="url"
                        value={newEnv.url}
                        onChange={(e) =>
                          setNewEnv((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://fullnode.network.sui.io:443"
                        className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                      />
                    </div>

                    <div className="flex gap-2">
                      {Object.entries(NETWORK_INFO).map(([network, info]) => (
                        <Button
                          key={network}
                          variant="outline"
                          onClick={() =>
                            setNewEnv({ alias: network, url: info.url })
                          }
                          className="flex-1 border-[var(--vscode-editorWidget-border)] hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
                        >
                          {network}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={handleAddEnv}
                      disabled={loading || !newEnv.alias || !newEnv.url}
                      className="w-full bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Network"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        <StatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          loading={loading}
          status={status}
          loadingTitle="Processing..."
          loadingMessage="Please wait while processing..."
          successTitle="Operation Successful"
          errorTitle="Operation Failed"
        />
      </Card>
    </div>
  );
}
