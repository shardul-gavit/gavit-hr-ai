import { useMemo, useState } from "react";
import { useAuth } from "@/store/Auth";
import { useAppData } from "@/store/AppData";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Circle, Upload, Mail, FileText, GraduationCap, ListChecks, Send } from "lucide-react";
import { toast } from "sonner";

interface Step {
  key: string;
  title: string;
  description: string;
  icon: any;
}

const STEPS: Step[] = [
  { key: "account", title: "Account created", description: "Login credentials issued and verified", icon: Check },
  { key: "documents", title: "Documents uploaded", description: "PAN, Aadhaar, qualifications and address proof", icon: Upload },
  { key: "policy", title: "Policy accepted", description: "HR policies, code of conduct and POSH acknowledged", icon: FileText },
  { key: "kit", title: "Welcome kit shared", description: "Laptop, ID card and welcome pack delivered", icon: Mail },
  { key: "task", title: "First task assigned", description: "Manager assigns initial onboarding task", icon: ListChecks },
  { key: "induction", title: "Induction completed", description: "Company orientation and team intro session", icon: GraduationCap },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const { pushNotification } = useAppData();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = useMemo(() => STEPS.filter((s) => done[s.key]).length, [done]);
  const percent = Math.round((completed / STEPS.length) * 100);

  const toggle = (key: string) => {
    setDone((p) => {
      const next = { ...p, [key]: !p[key] };
      const step = STEPS.find((s) => s.key === key);
      if (step && !p[key]) {
        toast.success(`${step.title} ✓`);
        pushNotification({ title: "Onboarding step completed", message: step.title, category: "onboarding" });
      }
      return next;
    });
  };

  const sendReminder = () => {
    toast.success("Reminder sent to candidate's email");
    pushNotification({ title: "Onboarding reminder sent", message: `Pending steps reminder to ${user?.name || "new joiner"}`, category: "onboarding" });
  };

  const completeAll = () => {
    setDone(Object.fromEntries(STEPS.map((s) => [s.key, true])));
    toast.success("Onboarding completed 🎉");
    pushNotification({ title: "Onboarding completed", message: `${user?.name || "New joiner"} is fully onboarded`, category: "onboarding" });
  };

  return (
    <>
      <PageHeader
        title="Employee Onboarding"
        description="Track new joiner readiness across documents, policies, kit and induction"
        actions={
          <>
            <Button variant="outline" onClick={sendReminder}><Send className="h-4 w-4 mr-1.5" />Send Reminder</Button>
            <Button onClick={completeAll} disabled={percent === 100}>Complete Onboarding</Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="font-display font-bold text-xl">{user?.name || "New Joiner"}</p>
              <p className="text-sm text-muted-foreground">{user?.designation || "Software Engineer"} · Started {new Date().toLocaleDateString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-primary">{percent}%</p>
              <p className="text-xs text-muted-foreground">{completed} of {STEPS.length} steps</p>
            </div>
          </div>
          <Progress value={percent} className="h-2.5" />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const isDone = !!done[step.key];
          return (
            <Card key={step.key} className={isDone ? "border-success/40 bg-success-soft/30" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {isDone ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">Step {i + 1}</span>
                    <p className="font-semibold">{step.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <Button size="sm" variant={isDone ? "outline" : "default"} onClick={() => toggle(step.key)}>
                  {isDone ? "Mark Pending" : "Mark Done"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
