import { useState, useMemo } from "react";
import { useAppData } from "@/store/AppData";
import { useAuth } from "@/store/Auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Calendar, Wallet, Users, CheckCircle2, XCircle, Clock, FileText, Briefcase, ScrollText, BookOpen, Megaphone, Settings as SettingsIcon, Receipt, Bot, BarChart3, Sparkles, Eye, Send, IndianRupee, Search, ListChecks, Award, FileSpreadsheet, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, subMonths } from "date-fns";
import type { Role } from "@/types";

const months = Array.from({ length: 6 }).map((_, i) => ({ m: format(subMonths(new Date(), 5 - i), "MMM"), v: 30 + i * 8 + Math.floor(Math.random() * 12), v2: 20 + i * 5 + Math.floor(Math.random() * 8) }));

/* ============ LEAVE ============ */
export function LeavePage({ scope = "all" }: { scope?: "all" | "mine" }) {
  const { user } = useAuth();
  const { leaves, addLeave, updateLeaveStatus, pushNotification } = useAppData();
  const [open, setOpen] = useState(false);
  const list = useMemo(() => scope === "mine" ? leaves.filter((l) => l.employeeName === user?.name) : leaves, [leaves, scope, user]);
  const balance = [{ type: "Casual", used: 4, total: 12, color: "primary" }, { type: "Sick", used: 3, total: 8, color: "info" }, { type: "Paid", used: 5, total: 15, color: "success" }, { type: "Emergency", used: 0, total: 3, color: "warning" }];
  return (
    <>
      <PageHeader title={scope === "mine" ? "My Leave" : "Leave Management"} description="Apply, approve and track time-off requests"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Apply Leave</Button>}
      />
      {scope === "mine" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {balance.map((b) => (
            <Card key={b.type}><CardContent className="p-5">
              <p className="text-xs uppercase font-semibold text-muted-foreground">{b.type} Leave</p>
              <p className="text-2xl font-bold font-display mt-1">{b.total - b.used}<span className="text-base text-muted-foreground"> / {b.total}</span></p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden"><div className={`h-full bg-${b.color}`} style={{ width: `${((b.total - b.used) / b.total) * 100}%`, background: `hsl(var(--${b.color}))` }} /></div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Card><CardContent className="p-4">
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="bg-secondary/40"><TableHead>ID</TableHead><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>{list.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs">{l.id}</TableCell>
                <TableCell className="font-semibold text-sm">{l.employeeName}</TableCell>
                <TableCell><span className="text-xs px-2 py-0.5 rounded bg-secondary">{l.type}</span></TableCell>
                <TableCell className="text-sm">{l.fromDate}</TableCell>
                <TableCell className="text-sm">{l.toDate}</TableCell>
                <TableCell className="text-sm">{l.days}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">{l.reason}</TableCell>
                <TableCell><StatusBadge status={l.status} /></TableCell>
                <TableCell>{l.status === "Pending" && scope !== "mine" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => { updateLeaveStatus(l.id, "Approved"); pushNotification({ title: "Leave approved", message: `${l.employeeName}'s ${l.type} approved`, category: "leave" }); toast.success("Leave approved"); }}><CheckCircle2 className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => { updateLeaveStatus(l.id, "Rejected"); toast.error("Leave rejected"); }}><XCircle className="h-4 w-4" /></Button>
                  </div>
                )}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent>
        <DialogHeader><DialogTitle>Apply for leave</DialogTitle></DialogHeader>
        <ApplyLeaveForm onSubmit={(d) => { addLeave({ ...d, employeeId: user!.id, employeeName: user!.name, companyId: user!.companyId || "c1", status: "Pending" }); toast.success("Leave request submitted"); setOpen(false); }} />
      </DialogContent></Dialog>
    </>
  );
}
function ApplyLeaveForm({ onSubmit }: { onSubmit: (d: any) => void }) {
  const [f, setF] = useState({ type: "Casual Leave" as const, fromDate: new Date().toISOString().slice(0, 10), toDate: new Date().toISOString().slice(0, 10), reason: "" });
  const days = Math.max(1, Math.ceil((new Date(f.toDate).getTime() - new Date(f.fromDate).getTime()) / 86400000) + 1);
  return (
    <div className="space-y-3">
      <div className="space-y-1.5"><Label>Type</Label>
        <Select value={f.type} onValueChange={(v: any) => setF({ ...f, type: v })}><SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{["Casual Leave","Sick Leave","Paid Leave","Unpaid Leave","Maternity Leave","Emergency Leave"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>From</Label><Input type="date" value={f.fromDate} onChange={(e) => setF({ ...f, fromDate: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>To</Label><Input type="date" value={f.toDate} onChange={(e) => setF({ ...f, toDate: e.target.value })} /></div>
      </div>
      <div className="space-y-1.5"><Label>Reason</Label><Textarea rows={3} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div>
      <div className="rounded-lg bg-primary-soft p-3 text-sm text-primary font-semibold">Total days: {days}</div>
      <Button className="w-full" onClick={() => { if (!f.reason) return toast.error("Please add reason"); onSubmit({ ...f, days }); }}>Submit Request</Button>
    </div>
  );
}

/* ============ ATTENDANCE ============ */
export function AttendancePage({ scope = "all" }: { scope?: "all" | "mine" }) {
  const { user } = useAuth();
  const { attendance, toggleAttendance, todayAttendance } = useAppData();
  const list = useMemo(() => scope === "mine" ? attendance.filter((a) => a.employeeId === user?.id) : attendance, [attendance, scope, user]);
  const today = scope === "mine" && user ? todayAttendance(user.id) : null;
  const counts = { present: list.filter((a) => a.status === "Present").length, absent: list.filter((a) => a.status === "Absent").length, late: list.filter((a) => a.status === "Late").length, leave: list.filter((a) => a.status === "On Leave").length };
  return (
    <>
      <PageHeader title={scope === "mine" ? "My Attendance" : "Attendance"} description="Track daily punch records, hours and leave status"
        actions={scope === "mine" ? (
          <Button onClick={() => { const r = toggleAttendance(user!.id, user!.name, user!.companyId || "c1"); toast.success(r === "in" ? "Checked in successfully" : "Checked out successfully"); }} className={today?.checkIn && !today?.checkOut ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90"}>
            <Clock className="h-4 w-4 mr-1.5" />{today?.checkIn && !today?.checkOut ? "Check Out" : "Check In"}
          </Button>
        ) : <Button variant="outline" onClick={() => toast.success("Report exported")}><Download className="h-4 w-4 mr-1.5" />Export</Button>}
      />
      {scope === "mine" && today && (
        <Card className="mb-6"><CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-xl gradient-primary grid place-items-center"><Clock className="h-5 w-5 text-white" /></div>
            <div><p className="text-sm text-muted-foreground">Today</p><p className="font-bold font-display">{today.checkIn || "Not checked in"} → {today.checkOut || "—"}</p></div></div>
          <StatusBadge status={today.status} />
        </CardContent></Card>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Present" value={counts.present} icon={CheckCircle2} tone="success" />
        <StatCard label="Absent" value={counts.absent} icon={XCircle} tone="destructive" />
        <StatCard label="Late" value={counts.late} icon={Clock} tone="warning" />
        <StatCard label="On Leave" value={counts.leave} icon={Calendar} tone="info" />
      </div>
      <Card><CardContent className="p-4">
        <div className="rounded-lg border overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-secondary/40"><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Hours</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{list.slice(0, 25).map((a) => (
            <TableRow key={a.id}>
              <TableCell className="text-sm">{a.date}</TableCell>
              <TableCell className="font-semibold text-sm">{a.employeeName}</TableCell>
              <TableCell className="text-sm">{a.checkIn || "—"}</TableCell>
              <TableCell className="text-sm">{a.checkOut || "—"}</TableCell>
              <TableCell className="text-sm">{a.hours || 0} hrs</TableCell>
              <TableCell><StatusBadge status={a.status} /></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table></div>
      </CardContent></Card>
    </>
  );
}

/* ============ PAYROLL ============ */
export function PayrollPage({ scope = "all" }: { scope?: "all" | "mine" }) {
  const { user } = useAuth();
  const { payroll, updatePayrollStatus, runPayroll, pushNotification } = useAppData();
  const [preview, setPreview] = useState<typeof payroll[number] | null>(null);
  const list = useMemo(() => scope === "mine" ? payroll.filter((p) => p.employeeId === user?.id) : payroll, [payroll, scope, user]);
  const total = list.reduce((s, p) => s + p.net, 0);
  const pending = list.filter((p) => p.status === "Pending Approval").length;
  return (
    <>
      <PageHeader title={scope === "mine" ? "My Payroll" : "Payroll Management"} description="Run, approve and download payslips"
        actions={scope !== "mine" && <>
          <Button variant="outline" onClick={() => { runPayroll(); pushNotification({ title: "Payroll generated", message: "Pending approval", category: "payroll" }); toast.success("Payroll run started"); }}>Preview Salary</Button>
          <Button onClick={() => { runPayroll(); toast.success("March payroll run successfully"); }}><Wallet className="h-4 w-4 mr-1.5" />Run Payroll</Button>
        </>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Payout" value={`₹${(total / 100000).toFixed(2)}L`} icon={IndianRupee} tone="success" />
        <StatCard label="Employees" value={list.length} icon={Users} tone="primary" />
        <StatCard label="Pending Approval" value={pending} icon={Clock} tone="warning" />
        <StatCard label="Paid" value={list.filter((p) => p.status === "Paid").length} icon={CheckCircle2} tone="info" />
      </div>
      <Card><CardContent className="p-4">
        <div className="rounded-lg border overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-secondary/40"><TableHead>Employee</TableHead><TableHead>Month</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Deductions</TableHead><TableHead className="text-right">Net</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>{list.slice(0, 30).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-semibold text-sm">{p.employeeName}</TableCell>
              <TableCell className="text-sm">{p.month}</TableCell>
              <TableCell className="text-right text-sm">₹{p.gross.toLocaleString("en-IN")}</TableCell>
              <TableCell className="text-right text-sm text-destructive">-₹{(p.pf + p.esic + p.tax + p.otherDeductions).toLocaleString("en-IN")}</TableCell>
              <TableCell className="text-right font-bold">₹{p.net.toLocaleString("en-IN")}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell><div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7" onClick={() => setPreview(p)}><Eye className="h-4 w-4" /></Button>
                {p.status === "Pending Approval" && scope !== "mine" && <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => { updatePayrollStatus(p.id, "Approved"); toast.success("Approved"); }}><CheckCircle2 className="h-4 w-4" /></Button>}
                {p.status === "Approved" && scope !== "mine" && <Button size="sm" variant="ghost" className="h-7" onClick={() => { updatePayrollStatus(p.id, "Paid"); toast.success("Marked as paid"); }}>Mark Paid</Button>}
                {p.status === "Paid" && <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success("Payslip downloaded")}><Download className="h-4 w-4" /></Button>}
              </div></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table></div>
      </CardContent></Card>
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-md">
          {preview && <>
            <DialogHeader><DialogTitle>Payslip · {preview.month}</DialogTitle><DialogDescription>{preview.employeeName}</DialogDescription></DialogHeader>
            <div className="space-y-1.5 text-sm">
              {[["Basic", preview.basic],["HRA", preview.hra],["Allowances", preview.allowances],["Bonus", preview.bonus]].map(([l, v]) => <div key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span>₹{(v as number).toLocaleString("en-IN")}</span></div>)}
              <div className="flex justify-between font-semibold pt-2 border-t"><span>Gross</span><span>₹{preview.gross.toLocaleString("en-IN")}</span></div>
              {[["PF", preview.pf],["ESIC", preview.esic],["Tax", preview.tax]].map(([l, v]) => <div key={l} className="flex justify-between text-destructive"><span>{l}</span><span>-₹{(v as number).toLocaleString("en-IN")}</span></div>)}
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Net Pay</span><span className="text-success">₹{preview.net.toLocaleString("en-IN")}</span></div>
            </div>
            <Button className="w-full" onClick={() => toast.success("Payslip downloaded")}><Download className="h-4 w-4 mr-1.5" />Download PDF</Button>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============ BILLING / INVOICES ============ */
export function BillingPage() {
  const { invoices, addInvoice, updateInvoice, companies } = useAppData();
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Subscriptions & Billing" description="Manual invoice management — no payment gateways"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Create Invoice</Button>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Invoices" value={invoices.length} icon={Receipt} tone="primary" />
        <StatCard label="Paid" value={invoices.filter((i) => i.status === "Paid").length} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={invoices.filter((i) => i.status === "Pending").length} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={invoices.filter((i) => i.status === "Overdue").length} icon={XCircle} tone="destructive" />
      </div>
      <Card><CardContent className="p-4"><div className="rounded-lg border overflow-x-auto"><Table>
        <TableHeader><TableRow className="bg-secondary/40"><TableHead>Invoice</TableHead><TableHead>Company</TableHead><TableHead>Plan</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Date</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{invoices.slice(0, 25).map((i) => (
          <TableRow key={i.id}>
            <TableCell className="font-mono text-xs">{i.id}</TableCell>
            <TableCell className="font-semibold text-sm">{i.companyName}</TableCell>
            <TableCell><span className="text-xs px-2 py-0.5 rounded bg-primary-soft text-primary font-semibold">{i.plan}</span></TableCell>
            <TableCell className="text-right font-bold">₹{i.amount.toLocaleString("en-IN")}</TableCell>
            <TableCell className="text-sm">{i.invoiceDate}</TableCell>
            <TableCell className="text-sm">{i.dueDate}</TableCell>
            <TableCell><StatusBadge status={i.status} /></TableCell>
            <TableCell><div className="flex gap-1">
              {i.status !== "Paid" && <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => { updateInvoice(i.id, { status: "Paid" }); toast.success("Marked as paid"); }}>Mark Paid</Button>}
              {i.status === "Overdue" && <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success("Reminder sent")}><Send className="h-4 w-4" /></Button>}
              <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success("Invoice downloaded")}><Download className="h-4 w-4" /></Button>
            </div></TableCell>
          </TableRow>
        ))}</TableBody>
      </Table></div></CardContent></Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent>
        <DialogHeader><DialogTitle>Create invoice</DialogTitle></DialogHeader>
        <CreateInvoiceForm companies={companies} onCreate={(d) => { addInvoice(d); toast.success("Invoice created"); setOpen(false); }} />
      </DialogContent></Dialog>
    </>
  );
}
function CreateInvoiceForm({ companies, onCreate }: { companies: any[]; onCreate: (d: any) => void }) {
  const [f, setF] = useState({ companyId: companies[0]?.id || "", plan: "Growth", amount: 28000, invoiceDate: new Date().toISOString().slice(0, 10), dueDate: "", status: "Pending" as const, notes: "" });
  return (
    <div className="space-y-3">
      <div className="space-y-1.5"><Label>Company</Label>
        <Select value={f.companyId} onValueChange={(v) => setF({ ...f, companyId: v })}><SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Plan</Label>
          <Select value={f.plan} onValueChange={(v) => setF({ ...f, plan: v })}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Starter","Growth","Premium","Enterprise"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: +e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Invoice date</Label><Input type="date" value={f.invoiceDate} onChange={(e) => setF({ ...f, invoiceDate: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      <Button className="w-full" onClick={() => { const c = companies.find((x) => x.id === f.companyId); onCreate({ ...f, companyName: c?.name || "" }); }}>Create Invoice</Button>
    </div>
  );
}

/* ============ DOCUMENTS ============ */
export function DocumentsPage() {
  const templates = [
    { id: "offer", name: "Offer Letter", desc: "Standard appointment offer" },
    { id: "appointment", name: "Appointment Letter", desc: "Confirmation of joining" },
    { id: "experience", name: "Experience Letter", desc: "For exiting employees" },
    { id: "relieving", name: "Relieving Letter", desc: "Last working day" },
    { id: "warning", name: "Warning Letter", desc: "Disciplinary notice" },
    { id: "salary-cert", name: "Salary Certificate", desc: "For loan / visa" },
    { id: "internship", name: "Internship Letter", desc: "For interns" },
  ];
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <PageHeader title="Document Generator" description="Generate HR letters and certificates from premium templates" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActive(t.id)}>
            <CardContent className="p-5">
              <div className="h-11 w-11 rounded-xl gradient-soft grid place-items-center mb-3"><FileText className="h-5 w-5 text-primary" /></div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Generate {templates.find((t) => t.id === active)?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Employee</Label>
              <Select defaultValue="emp1"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="emp1">Ananya Sharma</SelectItem><SelectItem value="emp2">Karan Kumar</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border bg-secondary/30 p-4 text-sm space-y-2 max-h-64 overflow-y-auto">
              <p className="font-bold">Tata Innovations Pvt Ltd</p>
              <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString("en-IN")}</p>
              <p className="mt-3">Dear Ananya Sharma,</p>
              <p>We are pleased to confirm your appointment as <b>Senior Software Engineer</b> in our Engineering department, effective from your date of joining.</p>
              <p>Your annual CTC will be <b>₹15,00,000</b> as per the agreed compensation structure.</p>
              <p>We look forward to your contributions.</p>
              <p className="mt-3">Sincerely,<br /><b>HR Department</b></p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => { toast.success("Document downloaded as PDF"); setActive(null); }}><Download className="h-4 w-4 mr-1.5" />Download</Button>
              <Button variant="outline" className="flex-1" onClick={() => { toast.success("Document emailed"); setActive(null); }}><Send className="h-4 w-4 mr-1.5" />Email</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============ RECRUITMENT ============ */
export function RecruitmentPage() {
  const { jobs, candidates, updateCandidateStatus, addJob } = useAppData();
  const [tab, setTab] = useState("candidates");
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Recruitment" description="Job openings, applicants and AI-powered resume screening"
        actions={<><Button variant="outline" onClick={() => toast.info("Resume upload simulated")}><Plus className="h-4 w-4 mr-1.5" />Upload Resume</Button><Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Add Job Opening</Button></>}
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger><TabsTrigger value="jobs">Job Openings ({jobs.length})</TabsTrigger></TabsList>
        <TabsContent value="candidates" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {candidates.map((c) => (
              <Card key={c.id}><CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center text-white font-bold text-sm">{c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0"><p className="font-semibold truncate">{c.name}</p><p className="text-xs text-muted-foreground truncate">{c.jobTitle} · {c.experience} yrs · {c.qualification}</p></div>
                      <div className="text-right"><p className="text-2xl font-bold font-display text-primary">{c.score}</p><p className="text-[10px] text-muted-foreground -mt-1">FIT SCORE</p></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">{c.skills.slice(0, 4).map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-secondary">{s}</span>)}</div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <StatusBadge status={c.status} />
                      {c.score >= 80 && <span className="text-[10px] px-2 py-0.5 rounded bg-success-soft text-success font-bold inline-flex items-center gap-1"><Award className="h-2.5 w-2.5" />RECOMMENDED</span>}
                      <div className="ml-auto flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => { updateCandidateStatus(c.id, "Shortlisted"); toast.success("Shortlisted"); }}><CheckCircle2 className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => { updateCandidateStatus(c.id, "Interview Scheduled"); toast.success("Interview scheduled"); }}>Interview</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => { updateCandidateStatus(c.id, "Rejected"); toast.error("Rejected"); }}><XCircle className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="jobs" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {jobs.map((j) => (
              <Card key={j.id}><CardContent className="p-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center"><Briefcase className="h-5 w-5" /></div>
                <div className="flex-1"><p className="font-semibold">{j.title}</p><p className="text-xs text-muted-foreground">{j.department} · {j.location} · {j.openings} openings</p></div>
                <div className="text-right"><p className="text-lg font-bold">{j.applicants}</p><p className="text-[10px] text-muted-foreground">APPLICANTS</p></div>
                <StatusBadge status={j.status} />
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent>
        <DialogHeader><DialogTitle>Post job opening</DialogTitle></DialogHeader>
        <NewJobForm onCreate={(d) => { addJob(d); toast.success("Job posted"); setOpen(false); }} />
      </DialogContent></Dialog>
    </>
  );
}
function NewJobForm({ onCreate }: { onCreate: (d: any) => void }) {
  const [f, setF] = useState({ title: "", department: "Engineering", location: "Bangalore", type: "Full-time", openings: 1, status: "Open" as const });
  return (
    <div className="space-y-3">
      <div className="space-y-1.5"><Label>Job title *</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Department</Label><Input value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Location</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Type</Label><Input value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Openings</Label><Input type="number" value={f.openings} onChange={(e) => setF({ ...f, openings: +e.target.value })} /></div>
      </div>
      <Button className="w-full" onClick={() => { if (!f.title) return toast.error("Job title required"); onCreate(f); }}>Post Job</Button>
    </div>
  );
}

/* ============ ANNOUNCEMENTS ============ */
export function AnnouncementsPage() {
  const { announcements, addAnnouncement } = useAppData();
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Announcements" description="Company-wide updates, holidays and notices"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Create Announcement</Button>}
      />
      <div className="space-y-3">
        {announcements.map((a) => (
          <Card key={a.id}><CardContent className="p-5 flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl gradient-soft grid place-items-center shrink-0"><Megaphone className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{a.title}</p><StatusBadge status={a.category} /><StatusBadge status={a.status} /></div>
              <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Audience: {a.audience} · Published: {a.publishedAt}</p>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent>
        <DialogHeader><DialogTitle>Create announcement</DialogTitle></DialogHeader>
        <NewAnnouncementForm onCreate={(d) => { addAnnouncement(d); toast.success("Announcement published"); setOpen(false); }} />
      </DialogContent></Dialog>
    </>
  );
}
function NewAnnouncementForm({ onCreate }: { onCreate: (d: any) => void }) {
  const [f, setF] = useState({ title: "", description: "", category: "General" as const, audience: "All" as const, status: "Published" as const });
  return (
    <div className="space-y-3">
      <div className="space-y-1.5"><Label>Title *</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
      <div className="space-y-1.5"><Label>Description *</Label><Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Category</Label>
          <Select value={f.category} onValueChange={(v: any) => setF({ ...f, category: v })}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["General","Holiday Notice","Payroll Update","Training","Urgent"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Audience</Label>
          <Select value={f.audience} onValueChange={(v: any) => setF({ ...f, audience: v })}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["All","HR","Employees","Admins"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { onCreate({ ...f, status: "Draft" }); }}>Save Draft</Button>
        <Button className="flex-1" onClick={() => { if (!f.title || !f.description) return toast.error("Fill all fields"); onCreate(f); }}>Publish</Button>
      </div>
    </div>
  );
}

/* ============ AUDIT, KB, SETTINGS, REPORTS, CHATBOT RULES, TEMPLATES ============ */
export function AuditPage() {
  const { audit } = useAppData();
  return (
    <>
      <PageHeader title="Audit Logs" description="Track every action across the platform" />
      <Card><CardContent className="p-4"><div className="rounded-lg border overflow-x-auto"><Table>
        <TableHeader><TableRow className="bg-secondary/40"><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Module</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
        <TableBody>{audit.map((a) => (
          <TableRow key={a.id}>
            <TableCell><p className="font-semibold text-sm">{a.user}</p><p className="text-xs text-muted-foreground">{a.role}</p></TableCell>
            <TableCell className="text-sm">{a.action}</TableCell>
            <TableCell><span className="text-xs px-2 py-0.5 rounded bg-secondary">{a.module}</span></TableCell>
            <TableCell className="text-sm">{a.companyName}</TableCell>
            <TableCell><StatusBadge status={a.status} /></TableCell>
            <TableCell className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("en-IN")}</TableCell>
          </TableRow>
        ))}</TableBody>
      </Table></div></CardContent></Card>
    </>
  );
}

export function KnowledgeBasePage() {
  const articles = [
    { cat: "Getting Started", icon: Sparkles, items: ["Onboarding for new employees", "Setting up your profile", "Mobile app guide"] },
    { cat: "Leave & Attendance", icon: Calendar, items: ["Leave policy v2.1", "How to apply leave", "Attendance corrections"] },
    { cat: "Payroll", icon: Wallet, items: ["Understanding your payslip", "Tax declarations", "Reimbursement claims"] },
    { cat: "Support", icon: BookOpen, items: ["How to raise a ticket", "Escalation matrix", "Chatbot usage guide"] },
  ];
  return (
    <>
      <PageHeader title="Knowledge Base" description="Self-service help center with HR policies and guides" />
      <div className="relative max-w-xl mb-6">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search articles, policies, FAQs..." className="pl-9 h-11" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Card key={a.cat}><CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl gradient-soft grid place-items-center"><a.icon className="h-5 w-5 text-primary" /></div><p className="font-semibold">{a.cat}</p></div>
            <ul className="space-y-1.5">{a.items.map((i) => (
              <li key={i}><button onClick={() => toast.info(`Opening: ${i}`)} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 w-full text-left"><ChevronRight className="h-3 w-3" />{i}</button></li>
            ))}</ul>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Configure your workspace, permissions and policies" />
      <Tabs defaultValue="profile">
        <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="org">Organisation</TabsTrigger><TabsTrigger value="permissions">Permissions</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger></TabsList>
        <TabsContent value="profile" className="mt-4"><Card><CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue="Aditya Gavit" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="admin@gavit.in" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 9876543210" /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input defaultValue="Platform Owner" disabled /></div>
          </div>
          <Button onClick={() => toast.success("Profile saved")}>Save Changes</Button>
        </CardContent></Card></TabsContent>
        <TabsContent value="org" className="mt-4"><Card><CardContent className="p-6 space-y-4">
          <div className="space-y-1.5"><Label>Company name</Label><Input defaultValue="Gavit E-Services" /></div>
          <div className="space-y-1.5"><Label>Working hours</Label><Input defaultValue="09:30 AM - 06:30 PM" /></div>
          <div className="space-y-1.5"><Label>Time zone</Label><Input defaultValue="Asia/Kolkata (IST)" /></div>
          <Button onClick={() => toast.success("Settings saved")}>Save</Button>
        </CardContent></Card></TabsContent>
        <TabsContent value="permissions" className="mt-4"><Card><CardContent className="p-6 space-y-3">
          {["HR can approve leaves","HR can run payroll","Company Admin can manage HR users","Employees can view other employees","Super Admin has full access"].map((p, i) => (
            <div key={p} className="flex items-center justify-between py-2 border-b last:border-0">
              <p className="text-sm">{p}</p>
              <input type="checkbox" defaultChecked={i !== 3} className="h-4 w-4 accent-primary" />
            </div>
          ))}
        </CardContent></Card></TabsContent>
        <TabsContent value="notifications" className="mt-4"><Card><CardContent className="p-6 space-y-3">
          {["Email notifications","Push notifications","Leave request alerts","Payroll alerts","Support ticket updates"].map((n) => (
            <div key={n} className="flex items-center justify-between py-2 border-b last:border-0">
              <p className="text-sm">{n}</p>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
            </div>
          ))}
        </CardContent></Card></TabsContent>
      </Tabs>
    </>
  );
}

export function ReportsPage() {
  const data = months;
  return (
    <>
      <PageHeader title="Reports & Analytics" description="Comprehensive insights across all modules"
        actions={<Button variant="outline" onClick={() => toast.success("Report exported")}><Download className="h-4 w-4 mr-1.5" />Export</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card><CardHeader><CardTitle className="text-base font-display">Attendance Trend</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={240}><AreaChart data={data}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Area dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
          </AreaChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base font-display">Payroll Cost Trend</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={240}><BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[{l:"Attendance Report", i: Calendar},{l:"Leave Report", i: Calendar},{l:"Payroll Report", i: Wallet},{l:"Employee Report", i: Users},{l:"Support Report", i: Bot},{l:"Subscription Report", i: Receipt}].map((r) => (
          <Card key={r.l} className="cursor-pointer hover:shadow-md" onClick={() => toast.success(`${r.l} generated`)}><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary grid place-items-center"><r.i className="h-5 w-5" /></div>
            <div className="flex-1"><p className="font-semibold text-sm">{r.l}</p><p className="text-xs text-muted-foreground">Click to generate</p></div>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}

export function ChatbotRulesPage() {
  return (
    <>
      <PageHeader title="Chatbot Rules" description="Configure intents, quick actions and role-based responses" />
      <Card><CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["Employee","HR","Super Admin"] as const).map((r) => (
            <div key={r} className="rounded-xl border p-4">
              <p className="font-semibold mb-2">{r} Intents</p>
              <div className="space-y-1.5">{["Leave Balance","Payroll Status","Attendance","Raise Ticket","Policy Help"].map((i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"><span>{i}</span><span className="text-xs text-success font-semibold">Active</span></div>
              ))}</div>
              <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => toast.info("Intent editor coming soon")}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Intent</Button>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </>
  );
}

export function TemplatesPage() {
  return (
    <>
      <PageHeader title="Document Templates" description="Manage HR letter templates used across all companies" />
      <DocumentsPage />
    </>
  );
}

export function PlatformAnalyticsPage() { return <ReportsPage />; }
export function CompanyReportsPage() { return <ReportsPage />; }
export function HRReportsPage() { return <ReportsPage />; }

export function HRTeamPage() {
  return (
    <>
      <PageHeader title="HR Team" description="Manage your HR managers and admins"
        actions={<Button onClick={() => toast.success("HR Manager invite sent")}><Plus className="h-4 w-4 mr-1.5" />Add HR Manager</Button>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[{n:"Priya Mehta",d:"HR Manager",e:"priya.hr@tin.in"},{n:"Rohit Aggarwal",d:"HR Executive",e:"rohit.hr@tin.in"},{n:"Anita Kapoor",d:"Recruiter",e:"anita.hr@tin.in"}].map((p) => (
          <Card key={p.n}><CardContent className="p-5 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary mx-auto grid place-items-center text-white font-bold text-lg">{p.n.split(" ").map((n) => n[0]).join("")}</div>
            <p className="font-semibold mt-3">{p.n}</p><p className="text-xs text-muted-foreground">{p.d}</p><p className="text-xs text-muted-foreground mt-0.5">{p.e}</p>
            <div className="flex gap-2 mt-3"><Button size="sm" variant="outline" className="flex-1">View</Button><Button size="sm" variant="outline" className="flex-1">Edit</Button></div>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}

/* ============ DASHBOARDS ============ */
export function CompanyAdminDashboard() {
  const { employees, leaves, tickets, payroll, announcements } = useAppData();
  return (
    <>
      <PageHeader title="Company Dashboard" description="Tata Innovations Pvt Ltd · Active subscription"
        actions={<Button onClick={() => toast.success("HR Manager invited")}><Plus className="h-4 w-4 mr-1.5" />Add HR</Button>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={248} icon={Users} tone="primary" trend={{ value: 4.2 }} />
        <StatCard label="Active Today" value={221} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending Leaves" value={leaves.filter((l) => l.status === "Pending").length} icon={Calendar} tone="warning" />
        <StatCard label="Open Tickets" value={tickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved").length} icon={Bot} tone="info" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base font-display">Attendance Summary</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={240}><LineChart data={months}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Line type="monotone" dataKey="v" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 4 }} name="Present" />
            <Line type="monotone" dataKey="v2" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={{ r: 4 }} name="Absent" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base font-display">Latest Announcements</CardTitle></CardHeader><CardContent className="space-y-3">
          {announcements.slice(0, 3).map((a) => (
            <div key={a.id} className="flex gap-2"><div className="h-8 w-8 rounded-lg gradient-soft grid place-items-center shrink-0"><Megaphone className="h-4 w-4 text-primary" /></div>
              <div className="min-w-0"><p className="text-sm font-semibold truncate">{a.title}</p><p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p></div></div>
          ))}
        </CardContent></Card>
      </div>
    </>
  );
}

export function HRDashboard() {
  const { leaves, tickets, payroll, candidates } = useAppData();
  return (
    <>
      <PageHeader title="HR Operations" description="Daily HR command center for Tata Innovations" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={248} icon={Users} tone="primary" />
        <StatCard label="Present Today" value={221} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending Leaves" value={leaves.filter((l) => l.status === "Pending").length} icon={Calendar} tone="warning" />
        <StatCard label="Payroll Pending" value={payroll.filter((p) => p.status === "Pending Approval").length} icon={Wallet} tone="info" />
        <StatCard label="Open Queries" value={tickets.filter((t) => t.status !== "Closed").length} icon={Bot} tone="primary" />
        <StatCard label="Documents Today" value={12} icon={FileText} tone="success" />
        <StatCard label="New Applications" value={candidates.filter((c) => c.status === "Applied").length} icon={Briefcase} tone="info" />
        <StatCard label="Joining This Month" value={5} icon={Sparkles} tone="accent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base font-display">Pending Leave Approvals</CardTitle></CardHeader><CardContent className="space-y-2">
          {leaves.filter((l) => l.status === "Pending").slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40">
              <div className="h-9 w-9 rounded-full gradient-soft grid place-items-center text-primary font-bold text-xs">{l.employeeName.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{l.employeeName}</p><p className="text-xs text-muted-foreground">{l.type} · {l.days}d · {l.fromDate}</p></div>
              <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => toast.success("Approved")}><CheckCircle2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => toast.error("Rejected")}><XCircle className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base font-display">Recent Support Tickets</CardTitle></CardHeader><CardContent className="space-y-2">
          {tickets.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40">
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{t.subject}</p><p className="text-xs text-muted-foreground">{t.raisedBy} · {t.id}</p></div>
              <StatusBadge status={t.priority} /><StatusBadge status={t.status} />
            </div>
          ))}
        </CardContent></Card>
      </div>
    </>
  );
}

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { announcements, toggleAttendance, todayAttendance } = useAppData();
  const today = user ? todayAttendance(user.id) : null;
  const checkedIn = !!today?.checkIn && !today?.checkOut;
  return (
    <>
      <PageHeader title={`Hello, ${user?.name.split(" ")[0]} 👋`} description="Here's your snapshot for today" />
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2">
          <div className="p-6 gradient-primary text-white">
            <p className="text-xs uppercase tracking-wider opacity-80">Today's Status</p>
            <p className="text-3xl font-bold font-display mt-1">{today?.checkIn || "Not checked in"}</p>
            <p className="text-sm opacity-80 mt-1">{today?.checkOut ? `Checked out at ${today.checkOut}` : checkedIn ? "Currently working" : "Tap below to check in"}</p>
            <Button className="mt-4 bg-white text-primary hover:bg-white/90" onClick={() => { const r = toggleAttendance(user!.id, user!.name, user!.companyId || "c1"); toast.success(r === "in" ? "Checked in!" : "Checked out!"); }}>
              <Clock className="h-4 w-4 mr-1.5" />{checkedIn ? "Check Out" : "Check In"}
            </Button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Leave Balance</p><p className="text-xl font-bold font-display">23 / 38</p></div>
            <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Last Payslip</p><p className="text-xl font-bold font-display">₹1.06L</p></div>
            <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Attendance %</p><p className="text-xl font-bold font-display text-success">96%</p></div>
            <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Pending Tickets</p><p className="text-xl font-bold font-display">1</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base font-display">Quick Actions</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-2">
          {[{l:"Apply Leave", i:Calendar, to:"/me/leave"},{l:"Download Payslip", i:Download, to:"/me/payroll"},{l:"View Documents", i:FileText, to:"/me/documents"},{l:"Raise Ticket", i:Bot, to:"/me/support"}].map((a) => (
            <Button key={a.l} variant="outline" className="h-auto flex-col py-4 gap-1.5" onClick={() => window.location.assign(a.to)}>
              <a.i className="h-5 w-5 text-primary" /><span className="text-xs font-medium">{a.l}</span>
            </Button>
          ))}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base font-display">Latest Announcements</CardTitle></CardHeader><CardContent className="space-y-3">
          {announcements.slice(0, 3).map((a) => (
            <div key={a.id} className="flex gap-2"><div className="h-8 w-8 rounded-lg gradient-soft grid place-items-center shrink-0"><Megaphone className="h-4 w-4 text-primary" /></div>
              <div className="min-w-0"><p className="text-sm font-semibold truncate">{a.title}</p><p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p></div></div>
          ))}
        </CardContent></Card>
      </div>
    </>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="My Profile" description="Manage your personal information" />
      <Card><CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-2xl gradient-primary grid place-items-center text-white font-bold text-2xl">{user?.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
          <div><p className="text-xl font-bold font-display">{user?.name}</p><p className="text-sm text-muted-foreground">{user?.designation} · {user?.department}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue={user?.name} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={user?.email} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 9876543210" /></div>
          <div className="space-y-1.5"><Label>Department</Label><Input defaultValue={user?.department} disabled /></div>
        </div>
        <Button className="mt-4" onClick={() => toast.success("Profile updated")}>Save Changes</Button>
      </CardContent></Card>
    </>
  );
}

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  return (
    <>
      <PageHeader title="Announcements & Notifications" description="Stay updated with latest activity"
        actions={<Button variant="outline" onClick={markAllNotificationsRead}>Mark all read</Button>}
      />
      <Card><CardContent className="p-0"><div className="divide-y">
        {notifications.map((n) => (
          <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`w-full text-left p-4 hover:bg-secondary/40 flex gap-3 ${!n.read ? "bg-primary-soft/30" : ""}`}>
            <div className={`h-2 w-2 rounded-full mt-2 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
            <div className="flex-1"><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-muted-foreground">{n.message}</p></div>
            <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
          </button>
        ))}
      </div></CardContent></Card>
    </>
  );
}
