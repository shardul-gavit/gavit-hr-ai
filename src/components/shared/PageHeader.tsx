import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  const location = useLocation();
  const auto = breadcrumbs ?? location.pathname.split("/").filter(Boolean).map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ") }));

  return (
    <div className="mb-6 animate-in-up">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="h-3 w-3" />
        </Link>
        {auto.map((b, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            {b.to ? <Link to={b.to} className="hover:text-foreground transition-colors">{b.label}</Link> : <span className="text-foreground font-medium">{b.label}</span>}
          </span>
        ))}
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
