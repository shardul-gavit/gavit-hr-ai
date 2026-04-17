import { useState, useMemo } from "react";
import { useAppData } from "@/store/AppData";
import { useAuth } from "@/store/Auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Eye, Edit, UserX, Download, Trash2, FileText, KeyRound } from "lucide-react";
import { toast } from "sonner";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const { user } = useAuth();
  const { employees, addEmployee, updateEmployee, deleteEmployee, pushAudit } = useAppData();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [view, setView] = useState<Employee | null>(null);

  const list = useMemo(() => employees.filter((e) =>
    (!user?.companyId || e.companyId === user.companyId) &&
    (dept === "all" || e.department === dept) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.empCode.toLowerCase().includes(search.toLowerCase()))
  ), [employees, search, dept, user]);

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <>
      <PageHeader title="Employees" description={`${list.length} employees in your organisation`}
        actions={<><Button variant="outline" onClick={() => toast.success("Employees exported")}><Download className="h-4 w-4 mr-1.5" />Export</Button><Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Add Employee</Button></>}
      />
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={dept} onValueChange={setDept}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="bg-secondary/40">
                <TableHead>Employee</TableHead><TableHead>Code</TableHead><TableHead>Department</TableHead><TableHead>Designation</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {list.slice(0, 30).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full gradient-soft grid place-items-center text-primary text-xs font-bold">{e.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div><button onClick={() => setView(e)} className="font-semibold text-sm hover:text-primary">{e.name}</button><p className="text-xs text-muted-foreground">{e.email}</p></div></div></TableCell>
                    <TableCell className="font-mono text-xs">{e.empCode}</TableCell>
                    <TableCell className="text-sm">{e.department}</TableCell>
                    <TableCell className="text-sm">{e.designation}</TableCell>
                    <TableCell><span className="text-xs px-2 py-0.5 rounded bg-secondary">{e.employmentType}</span></TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setView(e)}><Eye className="h-4 w-4 mr-2" />View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit dialog opened")}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success("Offer letter generated")}><FileText className="h-4 w-4 mr-2" />Generate Offer Letter</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success(`Reset link sent to ${e.email}`)}><KeyRound className="h-4 w-4 mr-2" />Reset Password</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { updateEmployee(e.id, { status: "Inactive" }); pushAudit({ user: user!.name, role: user!.role, action: "Deactivated Employee", module: "Employees", companyName: user?.companyName || "", status: "Success" }); toast.success("Employee deactivated"); }}><UserX className="h-4 w-4 mr-2" />Deactivate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => { deleteEmployee(e.id); toast.success("Employee removed"); }}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEmployeeDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={(emp) => { addEmployee({ ...emp, companyId: user?.companyId || "c1" }); pushAudit({ user: user!.name, role: user!.role, action: "Created Employee", module: "Employees", companyName: user?.companyName || "", status: "Success" }); toast.success(`${emp.name} added`); setAddOpen(false); }} />

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl">
          {view && <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center text-white font-bold text-lg">{view.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                <div><DialogTitle className="text-xl">{view.name}</DialogTitle><p className="text-sm text-muted-foreground">{view.designation} · {view.department}</p></div>
              </div>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[["Employee Code", view.empCode],["Email", view.email],["Phone", view.phone],["Joining Date", view.joiningDate],["Type", view.employmentType],["Salary", `₹${view.salary.toLocaleString("en-IN")}`],["PAN", view.pan || "-"],["Aadhaar", view.aadhaar || "-"]].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-secondary/50 p-3"><p className="text-[10px] uppercase font-semibold text-muted-foreground">{l}</p><p className="text-sm font-semibold mt-0.5">{v}</p></div>
              ))}
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddEmployeeDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (e: Omit<Employee, "id" | "companyId">) => void }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", department: "Engineering", designation: "Software Engineer", joiningDate: new Date().toISOString().slice(0, 10), employmentType: "Full-time" as const, salary: 50000, empCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`, status: "Active" as const, gender: "Male" as const });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Add new employee</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5"><Label>Full name *</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+91" /></div>
          <div className="space-y-1.5"><Label>Department</Label>
            <Select value={f.department} onValueChange={(v) => setF({ ...f, department: v })}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Engineering","Product","Design","Sales","Marketing","HR","Finance","Operations"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Designation</Label><Input value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Joining date</Label><Input type="date" value={f.joiningDate} onChange={(e) => setF({ ...f, joiningDate: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Salary (CTC)</Label><Input type="number" value={f.salary} onChange={(e) => setF({ ...f, salary: +e.target.value })} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => { if (!f.name || !f.email) return toast.error("Fill required fields"); onAdd(f); }}>Add Employee</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
