import * as React from "react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Defining loadingVariants using CVA to manage dynamic CSS classes for the Loading component
const loadingVariants = cva(
    "flex items-center justify-center",
    {
        variants: {
            size: {
                small: "w-4 h-4",
                medium: "w-8 h-8",
                large: "w-12 h-12",
            },
        },
        defaultVariants: {
            size: "medium",
        },
    },
)

// Defining a Loading component using React.forwardRef to pass refs to the underlying div element
const Loading = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof loadingVariants>
>(({ className, size, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            loadingVariants({ size }),
            "text-[var(--vscode-editor-foreground)]",
            className
        )}
        {...props}
    >
        <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
            ></path>
        </svg>
    </div>
))
// Setting a display name for the Loading component
Loading.displayName = "Loading"

// Exporting the Loading component for use in other parts of the application
export { Loading }