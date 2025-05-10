import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Alert, AlertDescription } from "./ui/alert"
import { Button } from "./ui/button"

export interface StatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  status: {
    type: "success" | "error" | null
    message: string
  }
  loadingTitle?: string
  loadingMessage?: string
  successTitle?: string
  errorTitle?: string
  successAction?: {
    label: string
    onClick: () => void
  }
  link?: {
    label: string
    transactionLink?: string
  }
  preventCloseWhileLoading?: boolean
}

export function StatusDialog({
  open,
  onOpenChange,
  loading,
  status,
  loadingTitle = "Processing...",
  loadingMessage = "Please wait while processing...",
  successTitle = "Operation Successful",
  errorTitle = "Operation Failed",
  successAction,
  preventCloseWhileLoading = true,
  link,
}: StatusDialogProps) {
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (!loading || !preventCloseWhileLoading) {
          onOpenChange(open)
        }
      }}
    >
      <AlertDialogContent className="bg-[var(--vscode-editor-background)] border border-[var(--vscode-editorWidget-border)] max-h-[85vh] overflow-hidden flex flex-col p-6">
        {loading ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-[var(--vscode-editor-foreground)]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{loadingTitle}</span>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4 overflow-y-auto">
              <p className="text-[var(--vscode-editor-foreground)]/70">{loadingMessage}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose} className="hover:bg-[var(--vscode-button-hoverBackground)]">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-[var(--vscode-editor-foreground)]">
                {status.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-[var(--vscode-button-foreground)]" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-[var(--vscode-errorForeground)]" />
                )}
                <span>{status.type === "success" ? successTitle : errorTitle}</span>
              </AlertDialogTitle>
            </AlertDialogHeader>

            {status.message && (
              <div className="flex-1 overflow-y-auto my-4">
                <Alert
                  variant={status.type === "success" ? "default" : "destructive"}
                  className="bg-[var(--vscode-editor-background)] border border-[var(--vscode-editorWidget-border)]"
                >
                  <AlertDescription>
                    <pre
                      className={`font-mono text-sm whitespace-pre-wrap break-all ${status.type === "success"
                          ? "text-[var(--vscode-button-foreground)]"
                          : "text-[var(--vscode-errorForeground)]"
                        }`}
                    >
                      {status.message}
                    </pre>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-[var(--vscode-button-hoverBackground)]">Close</AlertDialogCancel>
              {status.type === "success" && successAction && (
                <AlertDialogAction
                  className="bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)]"
                  onClick={successAction.onClick}
                >
                  {successAction.label}
                </AlertDialogAction>
              )}
              {status.type === "success" && link && (
                <Button asChild>
                  <a
                    href={link.transactionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-[var(--vscode-editor-foreground)] transition-colors bg-[var(--vscode-button-background)] rounded-md hover:bg-[var(--vscode-button-hoverBackground)] focus:outline-none focus:ring-2 focus:ring-[var(--vscode-focusBorder)] focus:ring-offset-2"
                  >
                    View on Explorer
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </Button>
              )}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

