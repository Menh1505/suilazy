// Importing React, a utility function 'cn', and class-variance-authority (CVA) for managing dynamic CSS classes
import * as React from "react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Defining alertVariants using CVA to manage dynamic CSS classes for the Alert component
const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    {
        variants: {
            variant: {
                default: "bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)] border-[var(--vscode-editorWidget-border)]",
                destructive: "bg-[var(--vscode-editorError-background,#ff0000)] text-[var(--vscode-editorError-foreground,#ffffff)] border-[var(--vscode-editorError-border,#ff0000)] [&>svg]:text-[var(--vscode-editorError-foreground,#ffffff)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

// Defining an Alert component using React.forwardRef to pass refs to the underlying div element
const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
Alert.displayName = "Alert"

// Defining an AlertTitle component using React.forwardRef to pass refs to the underlying h5 element
const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5
            ref={ref}
            className={cn(
                "mb-1 font-medium leading-none tracking-tight text-[var(--vscode-editor-foreground)]",
                className
            )}
            {...props}
        />
    ),
)
AlertTitle.displayName = "AlertTitle"

// Defining an AlertDescription component using React.forwardRef to pass refs to the underlying div element
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "text-sm text-[var(--vscode-editor-foreground)] [&_p]:leading-relaxed",
                className
            )}
            {...props}
        />
    ),
)
AlertDescription.displayName = "AlertDescription"

// Exporting all the defined components for use in other parts of the application
export { Alert, AlertTitle, AlertDescription }