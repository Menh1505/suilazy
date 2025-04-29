import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { SuiCommand } from "../../utils/utils";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
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
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [status, setStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const navigate = useNavigate();

  const fetchEnvironments = React.useCallback(() => {
    setLoading(true);
    window.vscode.postMessage({ command: SuiCommand.CLIENT_ENVS });
  }, []);

  const handleSwitchEnv = React.useCallback(
    (env: string) => {
      setLoading(true);
      window.vscode.postMessage({
        command: SuiCommand.CLIENT_SWITCH,
        data: { env },
      });

      const messageHandler = (event: MessageEvent) => {
        const message = event.data;
        if (message.type === "moveStatus" && message.status === "success") {
          fetchEnvironments();
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);
    },
    [fetchEnvironments]
  );

  const handleAddEnv = React.useCallback(() => {
    if (!newEnv.alias || !newEnv.url) {
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
    setNewEnv({ alias: "", url: "" });
  }, [newEnv]);

  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      setLoading(false);

      if (message.type === "error") {
        setError(message.message);
        setStatus({ type: "error", message: message.message });
        setStatusDialogOpen(true);
        return;
      }

      setError(null);

      if (message.type === "moveStatus" && message.status === "success") {
        const { environments, activeEnv } = message.data;

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

        setEnvironments(processedEnvs);
        setStatus({
          type: "success",
          message: message.message,
        });
        setStatusDialogOpen(true);
      }
    };

    window.addEventListener("message", messageHandler);
    fetchEnvironments();

    return () => window.removeEventListener("message", messageHandler);
  }, [fetchEnvironments]);

  return (
    <Card className="min-h-screen border-gray-800 bg-gray-900/50">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Network Manager
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-gray-700"
          >
            Back
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "switch" | "custom")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="switch">Switch Network</TabsTrigger>
            <TabsTrigger value="custom">Custom Network</TabsTrigger>
          </TabsList>

          <TabsContent value="switch" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Available Networks
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchEnvironments}
                  disabled={loading}
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
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{env.alias}</p>
                        <p className="text-sm text-gray-400">{env.url}</p>
                        {NETWORK_INFO[env.alias as keyof typeof NETWORK_INFO]
                          ?.description && (
                          <p className="text-xs text-gray-500">
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
                          className="border-gray-700"
                        >
                          Switch
                        </Button>
                      )}
                      {env.active && (
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Add New Network
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="alias">Network Alias</Label>
                  <Input
                    id="alias"
                    value={newEnv.alias}
                    onChange={(e) =>
                      setNewEnv((prev) => ({ ...prev, alias: e.target.value }))
                    }
                    placeholder="e.g., localnet"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="url">RPC URL</Label>
                  <Input
                    id="url"
                    value={newEnv.url}
                    onChange={(e) =>
                      setNewEnv((prev) => ({ ...prev, url: e.target.value }))
                    }
                    placeholder="https://fullnode.network.sui.io:443"
                    className="bg-gray-800 border-gray-700"
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
                      className="flex-1 border-gray-700"
                    >
                      {network}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleAddEnv}
                  disabled={loading || !newEnv.alias || !newEnv.url}
                  className="w-full"
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
  );
}
