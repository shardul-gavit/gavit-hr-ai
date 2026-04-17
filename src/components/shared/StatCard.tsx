import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive" | "info" | "accent";
  trend?: { value: number; positive?: boolean };
  hint?: string;
  onClick?: () => void;
}

const toneMap = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  destructive: "bg-destructive-soft text-destructive",
  info: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent-foreground",
} as const;

export function StatCard({ label, value, icon: Icon, tone = "primary", trend, hint, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "stat-card group animate-in-up",
        onClick && "cursor-pointer hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold font-display text-foreground">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("h-11 w-11 rounded-xl grid place-items-center transition-transform group-hover:scale-110", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-semibold", trend.positive !== false ? "text-success" : "text-destructive")}>
          {trend.positive !== false ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {trend.value}% <span className="text-muted-foreground font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
}
