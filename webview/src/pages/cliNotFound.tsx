"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function CliNotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Back Button */}
                <Button
                    variant="outline"
                    className="h-10 flex items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                    onClick={() => navigate("/")}
                >
                    <span>Back</span>
                </Button>

                <Alert variant="destructive" className="border-red-600/20 bg-red-600/10">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <AlertTitle className="text-red-400 text-lg">Sui CLI Not Found</AlertTitle>
                    <AlertDescription className="text-red-200 mt-2">
                        The Sui Command Line Interface (CLI) is not installed on your system. <br />
                        Click the link below to watch installation guide: <a href="https://docs.sui.io/guides/developer/getting-started/sui-install">Install Sui</a>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}