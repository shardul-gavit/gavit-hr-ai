import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  // Status
  Active: "bg-success-soft text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  "On Leave": "bg-info-soft text-info border-info/20",
  Suspended: "bg-destructive-soft text-destructive border-destructive/20",
  Trial: "bg-accent-soft text-accent-foreground border-accent/40",
  Pending: "bg-warning-soft text-warning border-warning/30",
  "Pending Approval": "bg-warning-soft text-warning border-warning/30",
  Approved: "bg-success-soft text-success border-success/20",
  Rejected: "bg-destructive-soft text-destructive border-destructive/20",
  Cancelled: "bg-muted text-muted-foreground border-border",
  Paid: "bg-success-soft text-success border-success/20",
  Overdue: "bg-destructive-soft text-destructive border-destructive/20",
  Draft: "bg-muted text-muted-foreground border-border",
  // Tickets
  Open: "bg-info-soft text-info border-info/20",
  Assigned: "bg-primary-soft text-primary border-primary/20",
  "In Progress": "bg-primary-soft text-primary border-primary/20",
  "Waiting for User": "bg-warning-soft text-warning border-warning/30",
  Escalated: "bg-destructive-soft text-destructive border-destructive/20",
  Resolved: "bg-success-soft text-success border-success/20",
  Closed: "bg-muted text-muted-foreground border-border",
  // Priority
  Low: "bg-muted text-muted-foreground border-border",
  Medium: "bg-info-soft text-info border-info/20",
  High: "bg-warning-soft text-warning border-warning/30",
  Critical: "bg-destructive-soft text-destructive border-destructive/20",
  // Health
  Good: "bg-success-soft text-success border-success/20",
  Average: "bg-warning-soft text-warning border-warning/30",
  Poor: "bg-destructive-soft text-destructive border-destructive/20",
  // Recruitment
  Applied: "bg-muted text-muted-foreground border-border",
  Screened: "bg-info-soft text-info border-info/20",
  Shortlisted: "bg-primary-soft text-primary border-primary/20",
  "Interview Scheduled": "bg-accent-soft text-accent-foreground border-accent/40",
  Selected: "bg-success-soft text-success border-success/20",
  // Audit
  Success: "bg-success-soft text-success border-success/20",
  Failed: "bg-destructive-soft text-destructive border-destructive/20",
  Published: "bg-success-soft text-success border-success/20",
  Archived: "bg-muted text-muted-foreground border-border",
  Present: "bg-success-soft text-success border-success/20",
  Absent: "bg-destructive-soft text-destructive border-destructive/20",
  Late: "bg-warning-soft text-warning border-warning/30",
  "Half Day": "bg-info-soft text-info border-info/20",
  Holiday: "bg-accent-soft text-accent-foreground border-accent/40",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cls = map[status] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-70")} />
      {status}
    </span>
  );
}
