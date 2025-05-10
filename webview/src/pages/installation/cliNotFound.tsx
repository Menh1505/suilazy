"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function CliNotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-vscode-background text-vscode-foreground p-6">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Back Button */}
                <Button
                    onClick={() => navigate("/")}
                >
                    <span>Back</span>
                </Button>

                <Alert variant="destructive" className="border-vscode-errorForeground/20 bg-vscode-errorForeground/10">
                    <AlertCircle className="h-5 w-5 text-vscode-errorForeground" />
                    <AlertTitle className="text-vscode-errorForeground text-lg">Sui CLI Not Found</AlertTitle>
                    <AlertDescription className="text-vscode-foreground mt-2">
                        The Sui Command Line Interface (CLI) is not installed on your system. <br />
                        Click the link below to watch the installation guide: <a href="https://docs.sui.io/guides/developer/getting-started/sui-install" className="text-vscode-buttonForeground underline hover:text-vscode-buttonHoverBackground">Install Sui</a>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}