import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { SuiCommand } from "../../utils/utils";
import { RefreshCw } from "lucide-react";

const DEFAULT_NETWORKS = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
};

export default function ClientNetwork() {
  const [environments, setEnvironments] = useState<{ alias: string; url: string; active: boolean }[]>([]);
  const [activeEnv, setActiveEnv] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newEnvAlias, setNewEnvAlias] = useState("");
  const [newEnvRpc, setNewEnvRpc] = useState("");
  const [cliOutput, setCliOutput] = useState<string>("");
  const navigate = useNavigate();

  const fetchEnvironments = () => {
    console.log("Fetching environments...");
    window.vscode.postMessage({ command: SuiCommand.CLIENT_ENVS });
  };

  const switchEnvironment = (env: string) => {
    console.log("Switching to environment:", env);
    window.vscode.postMessage({ command: SuiCommand.CLIENT_SWITCH, data: { env } });
  };

  const addEnvironment = () => {
    if (!newEnvAlias || !newEnvRpc) {
      setError("Please provide both alias and RPC URL.");
      return;
    }
    console.log("Adding new environment:", { alias: newEnvAlias, rpc: newEnvRpc });
    window.vscode.postMessage({
      command: SuiCommand.CLIENT_NEW_ENV,
      data: { alias: newEnvAlias, rpc: newEnvRpc },
    });
    setNewEnvAlias("");
    setNewEnvRpc("");
  };

  const setDefaultNetwork = (network: keyof typeof DEFAULT_NETWORKS) => {
    setNewEnvRpc(DEFAULT_NETWORKS[network]);
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("Received message:", message);

      if (message.type === "error") {
        console.error("Error received:", message.message);
        setError(message.message);
      } else {
        setError(null);
        if (message.type === "moveStatus" && message.data?.cliOutput) {
          setCliOutput(message.data.cliOutput);
        }
        if (message.type === "envs") {
          console.log("Environment list:", message.environments);
          console.log("Active environment:", message.activeEnv);
          setEnvironments(message.environments);
          setActiveEnv(message.activeEnv);
        }
        if (message.type === "switchEnv") {
          console.log("Switched to environment:", message.activeEnv);
          setActiveEnv(message.activeEnv);
        }
        if (message.type === "newEnv") {
          console.log("New environment added, refreshing list...");
          fetchEnvironments();
        }
      }
    };

    window.addEventListener("message", messageHandler);
    fetchEnvironments();

    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return (
    <div className="min-h-screen bg-vscode-background p-4">
      <Card className="w-full border-[var(--vscode-editorWidget-border)] bg-[var(--vscode-editor-background)]/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--vscode-editor-foreground)]">Network Configuration</h2>
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

            <div className="bg-[var(--vscode-editor-background)]/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-editor-foreground)]">Active Environments</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchEnvironments}
                  className="h-8 w-8 text-[var(--vscode-editor-foreground)] hover:text-[var(--vscode-button-foreground)]"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {cliOutput && (
                <div className="mb-4 p-4 bg-[var(--vscode-editor-background)]/50 rounded border border-[var(--vscode-editorWidget-border)]">
                  <pre className="text-sm text-[var(--vscode-editor-foreground)] whitespace-pre-wrap font-mono">
                    {cliOutput}
                  </pre>
                </div>
              )}
              <div className="space-y-2">
                {environments.map((env) => (
                  <div
                    key={env.alias}
                    onClick={() => switchEnvironment(env.alias)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${env.alias === activeEnv
                        ? "border-[var(--vscode-focusBorder)] bg-[var(--vscode-focusBorder)]/10"
                        : "border-[var(--vscode-editorWidget-border)] hover:border-[var(--vscode-focusBorder)]"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[var(--vscode-editor-foreground)] font-medium">{env.alias}</p>
                        <p className="text-[var(--vscode-editor-foreground)]/70 text-sm">{env.url}</p>
                      </div>
                      {env.alias === activeEnv && (
                        <div className="text-[var(--vscode-focusBorder)]">Active</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--vscode-editor-background)]/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[var(--vscode-editor-foreground)] mb-4">Add New Environment</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Environment Alias"
                  value={newEnvAlias}
                  onChange={(e) => setNewEnvAlias(e.target.value)}
                  className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                />
                <div className="flex gap-2 mb-2">
                  {Object.entries(DEFAULT_NETWORKS).map(([network]) => (
                    <Button
                      key={network}
                      onClick={() => setDefaultNetwork(network as keyof typeof DEFAULT_NETWORKS)}
                      variant="outline"
                      className="flex-1 border-[var(--vscode-editorWidget-border)] hover:bg-[var(--vscode-button-hoverBackground)] hover:text-[var(--vscode-button-foreground)]"
                    >
                      {network}
                    </Button>
                  ))}
                </div>
                <Input
                  type="text"
                  placeholder="RPC URL"
                  value={newEnvRpc}
                  onChange={(e) => setNewEnvRpc(e.target.value)}
                  className="bg-[var(--vscode-input-background)] border-[var(--vscode-input-border)]"
                />
                <Button
                  onClick={addEnvironment}
                  className="w-full bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)]"
                >
                  Add Environment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}