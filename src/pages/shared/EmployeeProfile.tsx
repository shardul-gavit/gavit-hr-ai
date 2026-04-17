import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "@/store/AppData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileText, KeyRound, UserX, Mail, Phone, Calendar, IndianRupee, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, payroll, leaves, attendance, tickets, updateEmployee } = useAppData();
  const emp = employees.find((e) => e.id === id);

  if (!emp) {
    return (
      <>
        <PageHeader title="Employee not found" description="The employee you're looking for doesn't exist." />
        <Button variant="outline" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4 mr-1.5" />Back</Button>
      </>
    );
  }

  const empPayroll = payroll.filter((p) => p.employeeId === emp.id);
  const empLeaves = leaves.filter((l) => l.employeeId === emp.id);
  const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
  const empTickets = tickets.filter((t) => t.raisedBy === emp.name);

  return (
    <>
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ChevronLeft className="h-4 w-4" />Back to employees</button>

      <Card className="mb-6">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl gradient-primary grid place-items-center text-white font-bold text-2xl shrink-0">
            {emp.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-bold text-2xl truncate">{emp.name}</h1>
              <StatusBadge status={emp.status} />
            </div>
            <p className="text-sm text-muted-foreground">{emp.designation} · {emp.department}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{emp.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{emp.phone}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {emp.joiningDate}</span>
              <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{emp.empCode}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Offer letter generated")}><FileText className="h-4 w-4 mr-1.5" />Offer Letter</Button>
            <Button variant="outline" onClick={() => toast.success(`Reset link sent to ${emp.email}`)}><KeyRound className="h-4 w-4 mr-1.5" />Reset Access</Button>
            {emp.status === "Active" ? (
              <Button variant="outline" className="text-destructive" onClick={() => { updateEmployee(emp.id, { status: "Inactive" }); toast.success("Employee deactivated"); }}><UserX className="h-4 w-4 mr-1.5" />Deactivate</Button>
            ) : (
              <Button onClick={() => { updateEmployee(emp.id, { status: "Active" }); toast.success("Employee reactivated"); }}>Reactivate</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll ({empPayroll.length})</TabsTrigger>
          <TabsTrigger value="attendance">Attendance ({empAttendance.length})</TabsTrigger>
          <TabsTrigger value="leave">Leave ({empLeaves.length})</TabsTrigger>
          <TabsTrigger value="tickets">Support ({empTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Employment", emp.employmentType],
              ["Manager", emp.manager || "—"],
              ["Annual CTC", `₹${emp.salary.toLocaleString("en-IN")}`],
              ["Gender", emp.gender || "—"],
              ["PAN", emp.pan || "—"],
              ["Aadhaar", emp.aadhaar || "—"],
              ["Phone", emp.phone],
              ["Joining", emp.joiningDate],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-secondary/40 p-3">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">{l}</p>
                <p className="text-sm font-semibold mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4 space-y-2">
          {empPayroll.length === 0 && <p className="text-sm text-muted-foreground">No payroll records yet.</p>}
          {empPayroll.map((p) => (
            <Card key={p.id}><CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center"><IndianRupee className="h-5 w-5" /></div>
              <div className="flex-1"><p className="font-semibold text-sm">{p.month}</p><p className="text-xs text-muted-foreground">Net ₹{p.net.toLocaleString("en-IN")} · Gross ₹{p.gross.toLocaleString("en-IN")}</p></div>
              <StatusBadge status={p.status} />
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="attendance" className="mt-4 space-y-2">
          {empAttendance.length === 0 && <p className="text-sm text-muted-foreground">No attendance records yet.</p>}
          {empAttendance.slice(0, 15).map((a) => (
            <Card key={a.id}><CardContent className="p-3 flex items-center gap-3 text-sm">
              <span className="font-mono text-xs w-24">{a.date}</span>
              <span className="flex-1">{a.checkIn || "—"} → {a.checkOut || "—"}</span>
              <span>{a.hours || 0} hrs</span>
              <StatusBadge status={a.status} />
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="leave" className="mt-4 space-y-2">
          {empLeaves.length === 0 && <p className="text-sm text-muted-foreground">No leave requests yet.</p>}
          {empLeaves.map((l) => (
            <Card key={l.id}><CardContent className="p-3 flex items-center gap-3 text-sm">
              <span className="font-mono text-xs">{l.id}</span>
              <span className="flex-1"><b>{l.type}</b> · {l.fromDate} → {l.toDate} ({l.days}d)</span>
              <StatusBadge status={l.status} />
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="tickets" className="mt-4 space-y-2">
          {empTickets.length === 0 && <p className="text-sm text-muted-foreground">No support tickets raised.</p>}
          {empTickets.map((t) => (
            <Card key={t.id}><CardContent className="p-3 flex items-center gap-3 text-sm">
              <span className="font-mono text-xs">{t.id}</span>
              <span className="flex-1 truncate">{t.subject}</span>
              <StatusBadge status={t.priority} />
              <StatusBadge status={t.status} />
            </CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
}
