import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: `
    bg-[var(--vscode-button-background)] 
    text-[var(--vscode-button-foreground)] 
    border border-[var(--vscode-editorWidget-border)]
    hover:bg-[var(--vscode-button-hoverBackground)] 
    hover:text-[var(--vscode-editor-foreground)] 
    hover:border-[var(--vscode-focusBorder)]
  `,
    outline: `
    bg-transparent 
    text-[var(--vscode-editor-foreground)] 
    border border-[var(--vscode-editorWidget-border)]
    hover:bg-[var(--vscode-editor-selectionBackground)] 
    hover:border-[var(--vscode-focusBorder)] 
    hover:text-[var(--vscode-editor-foreground)]
  `,
    ghost: `
    bg-transparent 
    text-[var(--vscode-editor-foreground)] 
    hover:bg-[var(--vscode-editor-selectionBackground)]
  `,
    link: `
    bg-transparent 
    text-[var(--vscode-editor-foreground)] 
    underline-offset-4 
    hover:underline
  `,
    destructive: `
    bg-[var(--vscode-editorError-background,#ff0000)] 
    text-[var(--vscode-editorError-foreground,#ffffff)] 
    border border-[var(--vscode-editorError-border,#ff0000)]
    hover:bg-[var(--vscode-editorError-hoverBackground,#ff4d4d)] 
    hover:border-[var(--vscode-editorError-border,#ff0000)]
  `,
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? "span" : "button";

        return (
            <Comp
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                    "ring-offset-[var(--vscode-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vscode-focusBorder)] focus-visible:ring-offset-2",
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {props.children}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button };