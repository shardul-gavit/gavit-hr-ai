import { useState, useMemo } from "react";
import { useAppData } from "@/store/AppData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Eye, Edit, Pause, Play, RotateCcw, FileText, Download, Building2 } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany, pushAudit } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [viewCompany, setViewCompany] = useState<Company | null>(null);

  const filtered = useMemo(() => companies.filter((c) =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (planFilter === "all" || c.plan === planFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  ), [companies, search, statusFilter, planFilter]);

  return (
    <>
      <PageHeader
        title="Companies"
        description={`${companies.length} companies onboarded on Gavit HR AI platform`}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Add Company</Button>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Trial">Trial</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.success("Companies exported as CSV")}><Download className="h-4 w-4 mr-1.5" />Export</Button>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40">
                  <TableHead>Company</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg gradient-soft grid place-items-center text-primary font-bold text-xs">{c.name.slice(0, 2).toUpperCase()}</div>
                        <button onClick={() => setViewCompany(c)} className="font-semibold text-sm hover:text-primary text-left">{c.name}</button>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs font-mono text-muted-foreground">{c.code}</span></TableCell>
                    <TableCell className="text-sm">{c.industry}</TableCell>
                    <TableCell><span className="text-xs px-2 py-0.5 rounded-md bg-primary-soft text-primary font-semibold">{c.plan}</span></TableCell>
                    <TableCell className="text-right font-semibold">{c.employeeCount}</TableCell>
                    <TableCell className="text-sm">{c.adminName}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell><StatusBadge status={c.supportHealth} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewCompany(c)}><Eye className="h-4 w-4 mr-2" />View Company</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditCompany(c)}><Edit className="h-4 w-4 mr-2" />Edit Details</DropdownMenuItem>
                          {c.status !== "Active" ? (
                            <DropdownMenuItem onClick={() => { updateCompany(c.id, { status: "Active" }); pushAudit({ user: "Gavit Admin", role: "super_admin", action: "Activated Company", module: "Companies", companyName: c.name, status: "Success" }); toast.success(`${c.name} activated`); }}>
                              <Play className="h-4 w-4 mr-2" />Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-destructive" onClick={() => setSuspendId(c.id)}><Pause className="h-4 w-4 mr-2" />Suspend</DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toast.success(`Access reset link sent to ${c.adminEmail}`)}><RotateCcw className="h-4 w-4 mr-2" />Reset Access</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setViewCompany(c)}><FileText className="h-4 w-4 mr-2" />View Audit History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No companies match the filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Company Modal */}
      <AddCompanyDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={(data) => { addCompany(data); pushAudit({ user: "Gavit Admin", role: "super_admin", action: "Created Company", module: "Companies", companyName: data.name, status: "Success" }); toast.success(`${data.name} added to platform`); setAddOpen(false); }} />
      {editCompany && <EditCompanyDialog company={editCompany} onClose={() => setEditCompany(null)} onSave={(p) => { updateCompany(editCompany.id, p); toast.success("Company details updated"); setEditCompany(null); }} />}
      {viewCompany && <ViewCompanyDrawer company={viewCompany} onClose={() => setViewCompany(null)} />}

      <AlertDialog open={!!suspendId} onOpenChange={(o) => !o && setSuspendId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend this company?</AlertDialogTitle>
            <AlertDialogDescription>The company admin and all employees will lose access immediately. You can re-activate any time.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (suspendId) { const c = companies.find((x) => x.id === suspendId); updateCompany(suspendId, { status: "Suspended" }); pushAudit({ user: "Gavit Admin", role: "super_admin", action: "Suspended Company", module: "Companies", companyName: c?.name || "", status: "Success" }); toast.success("Company suspended"); setSuspendId(null); } }}>Suspend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AddCompanyDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (c: any) => void }) {
  const [form, setForm] = useState({ name: "", code: "", industry: "Technology", plan: "Growth" as Company["plan"], employeeCount: 50, adminName: "", adminEmail: "", status: "Trial" as Company["status"] });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new company</DialogTitle>
          <DialogDescription>Onboard a new company to the Gavit HR AI platform.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5"><Label>Company name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Industries Pvt Ltd" /></div>
          <div className="space-y-1.5"><Label>Company code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ACM001" /></div>
          <div className="space-y-1.5"><Label>Industry</Label>
            <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Technology", "Manufacturing", "Healthcare", "Finance", "Retail", "Education", "Logistics", "IT Services"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Plan</Label>
            <Select value={form.plan} onValueChange={(v: any) => setForm({ ...form, plan: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Starter", "Growth", "Premium", "Enterprise"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Employee count</Label><Input type="number" value={form.employeeCount} onChange={(e) => setForm({ ...form, employeeCount: +e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Admin name *</Label><Input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} /></div>
          <div className="col-span-2 space-y-1.5"><Label>Admin email *</Label><Input type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!form.name || !form.code || !form.adminName || !form.adminEmail) return toast.error("Please fill required fields");
            const today = new Date(); const exp = new Date(today); exp.setDate(exp.getDate() + 30);
            onSubmit({ ...form, expiryDate: exp.toISOString().slice(0, 10), supportHealth: "Good", monthlyRevenue: form.plan === "Enterprise" ? 89000 : form.plan === "Premium" ? 56000 : form.plan === "Growth" ? 28000 : 12000 });
          }}>Add Company</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCompanyDialog({ company, onClose, onSave }: { company: Company; onClose: () => void; onSave: (p: Partial<Company>) => void }) {
  const [form, setForm] = useState(company);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit company</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Plan</Label>
            <Select value={form.plan} onValueChange={(v: any) => setForm({ ...form, plan: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Starter", "Growth", "Premium", "Enterprise"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Admin email</Label><Input value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ViewCompanyDrawer({ company, onClose }: { company: Company; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl gradient-primary grid place-items-center text-white font-bold">{company.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <DialogTitle className="text-xl">{company.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5"><span className="font-mono">{company.code}</span> · {company.industry}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { l: "Plan", v: company.plan },
            { l: "Status", v: company.status },
            { l: "Employees", v: company.employeeCount },
            { l: "Monthly Revenue", v: `₹${company.monthlyRevenue.toLocaleString("en-IN")}` },
            { l: "Admin", v: company.adminName },
            { l: "Admin Email", v: company.adminEmail },
            { l: "Expiry Date", v: company.expiryDate },
            { l: "Support Health", v: company.supportHealth },
          ].map((r) => (
            <div key={r.l} className="rounded-lg bg-secondary/50 p-3">
              <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">{r.l}</p>
              <p className="text-sm font-semibold mt-0.5">{r.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-4 mt-3">
          <p className="text-sm font-semibold mb-2">Recent Activity</p>
          <div className="space-y-2">
            {["Payroll run completed for 248 employees", "12 leave requests approved by HR", "3 new employees onboarded", "Invoice INV-2410 generated"].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> {a}</div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
