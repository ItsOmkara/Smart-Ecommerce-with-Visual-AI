import { cn } from "@/lib/utils"

function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}) {
    const variants = {
        default: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        secondary: "bg-slate-800 text-slate-300 border-slate-700",
        destructive: "bg-destructive/20 text-destructive border-destructive/30",
        outline: "text-foreground border-border",
        success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
