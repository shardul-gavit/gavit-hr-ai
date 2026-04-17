import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, ROLE_HOME, ROLE_LABEL } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Eye, EyeOff, Shield, Building2, UserCog, User, ArrowRight, CheckCircle2, BarChart3, MessageCircle, Bot, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Role } from "@/types";

const roleCards: { role: Role; icon: any; tone: string; desc: string }[] = [
  { role: "super_admin", icon: Shield, tone: "from-primary to-primary-glow", desc: "Gavit E-Services platform owner. Manage all companies, billing & escalations." },
  { role: "company_admin", icon: Building2, tone: "from-info to-primary", desc: "Manage your company, HR team, payroll runs and announcements." },
  { role: "hr", icon: UserCog, tone: "from-success to-info", desc: "Daily HR operations: employees, attendance, leave & payroll." },
  { role: "employee", icon: User, tone: "from-accent to-warning", desc: "Self-service portal for attendance, leave, payslips and support." },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<Role | "manual" | null>(null);

  const doLogin = (role: Role) => {
    setLoading(role);
    setTimeout(() => {
      const u = login(role);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`, { description: `Signed in as ${ROLE_LABEL[role]}` });
      navigate(ROLE_HOME[role]);
    }, 500);
  };

  const manualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading("manual");
    // Best-effort role inference from email domain — purely for the demo
    const inferred: Role =
      /admin@gavit/i.test(email) ? "super_admin" :
      /^hr|hr@|\.hr@/i.test(email) ? "hr" :
      /ceo|founder|admin@/i.test(email) ? "company_admin" :
      "employee";
    setTimeout(() => doLogin(inferred), 500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px, 60px 60px" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-xl grid place-items-center border border-white/20">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-bold text-xl leading-none">Gavit HR <span className="opacity-80">AI</span></p>
              <p className="text-[11px] text-white/70 mt-1">by Gavit E-Services</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display font-bold text-4xl leading-tight text-balance">Smart HR, Payroll & Employee Support — built for India.</h1>
          <p className="mt-4 text-white/80 text-base">A premium B2B HR platform managed and operated by Gavit E-Services. AI-powered support, automated payroll, real-time attendance, and proactive employee monitoring.</p>

          <div className="mt-8 space-y-3">
            {[
              { icon: BarChart3, t: "Multi-role dashboards", d: "Built for Super Admin, Company Admin, HR & Employees" },
              { icon: Bot, t: "Smart AI Assistant", d: "Resolves 70% of HR queries instantly" },
              { icon: MessageCircle, t: "Enterprise ticket system", d: "Escalation flow from Employee → HR → Gavit" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur grid place-items-center border border-white/20 shrink-0">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.t}</p>
                  <p className="text-xs text-white/70">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/70">
          <Lock className="h-3 w-3" /> Enterprise-grade security · ISO 27001 compliant
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold leading-none">Gavit HR <span className="text-primary">AI</span></p>
              <p className="text-[10px] text-muted-foreground mt-1">by Gavit E-Services</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-display font-bold text-3xl">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1.5">Sign in to your Gavit HR AI workspace</p>
          </div>

          <form onSubmit={manualLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="pwd" type={showPwd ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password visibility">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me for 30 days</Label>
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={!!loading}>
              {loading === "manual" ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Try a demo dashboard</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {roleCards.map((c) => (
              <button
                key={c.role}
                onClick={() => doLogin(c.role)}
                disabled={!!loading}
                className="group relative text-left rounded-xl border border-border bg-card p-3.5 hover:border-primary/40 hover:shadow-md transition-all duration-200 disabled:opacity-60"
              >
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${c.tone} grid place-items-center mb-2.5 shadow-sm`}>
                  <c.icon className="h-4.5 w-4.5 text-white" />
                </div>
                <p className="font-semibold text-sm">{ROLE_LABEL[c.role]}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{c.desc}</p>
                {loading === c.role && <div className="absolute inset-0 rounded-xl bg-card/80 grid place-items-center"><CheckCircle2 className="h-5 w-5 text-primary animate-pulse" /></div>}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Companies are onboarded by <span className="font-semibold text-foreground">Gavit E-Services</span>. Public self-registration is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
