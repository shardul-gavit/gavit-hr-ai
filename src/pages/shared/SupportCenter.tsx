import { useState, useMemo } from "react";
import { useAppData } from "@/store/AppData";
import { useAuth } from "@/store/Auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LifeBuoy, AlertCircle, CheckCircle2, Clock, Plus, Search, Send, Paperclip, ArrowUpCircle, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Ticket, TicketStatus, TicketPriority } from "@/types";
import { formatDistanceToNow } from "date-fns";

const STATUSES: TicketStatus[] = ["Open", "Assigned", "In Progress", "Waiting for User", "Escalated", "Resolved", "Closed"];

export default function SupportCenter({ scope = "all" }: { scope?: "all" | "company" | "mine" }) {
  const { user } = useAuth();
  const { tickets, addTicket, updateTicketStatus, addTicketReply, pushAudit, pushNotification } = useAppData();
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scoped = useMemo(() => {
    let list = tickets;
    if (scope === "company" && user?.companyId) list = list.filter((t) => t.companyId === user.companyId);
    if (scope === "mine" && user) list = list.filter((t) => t.raisedBy === user.name);
    return list;
  }, [tickets, scope, user]);

  const filtered = useMemo(() => scoped.filter((t) =>
    (statusTab === "all" || t.status === statusTab) &&
    (priorityFilter === "all" || t.priority === priorityFilter) &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()) || t.companyName.toLowerCase().includes(search.toLowerCase()))
  ), [scoped, statusTab, priorityFilter, search]);

  const stats = {
    total: scoped.length,
    open: scoped.filter((t) => ["Open", "Assigned", "In Progress"].includes(t.status)).length,
    escalated: scoped.filter((t) => t.status === "Escalated").length,
    resolved: scoped.filter((t) => ["Resolved", "Closed"].includes(t.status)).length,
  };

  const active = activeId ? scoped.find((t) => t.id === activeId) : null;

  return (
    <>
      <PageHeader
        title={scope === "mine" ? "My Support Tickets" : "Support Center"}
        description="Enterprise ticket flow: Employee → HR → Gavit Super Admin"
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Raise Ticket</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tickets" value={stats.total} icon={LifeBuoy} tone="primary" />
        <StatCard label="Open / In Progress" value={stats.open} icon={Clock} tone="info" />
        <StatCard label="Escalated" value={stats.escalated} icon={AlertCircle} tone="destructive" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} tone="success" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 mb-4">
            <Tabs value={statusTab} onValueChange={setStatusTab}>
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {STATUSES.map((s) => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
              </TabsList>
            </Tabs>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((t) => (
              <button key={t.id} onClick={() => setActiveId(t.id)} className="w-full text-left rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center font-mono text-[11px] font-bold shrink-0">{t.id.split("-")[1]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm truncate">{t.subject}</p>
                    <StatusBadge status={t.priority} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.companyName} · {t.raisedBy} · {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{t.category}</span>
                  <StatusBadge status={t.status} />
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No tickets found</p>}
          </div>
        </CardContent>
      </Card>

      <CreateTicketDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(data) => {
          const t = addTicket({ ...data, raisedBy: user!.name, raisedByRole: user!.role, companyId: user!.companyId || "c1", companyName: user!.companyName || "Gavit Platform", status: "Open" });
          pushAudit({ user: user!.name, role: user!.role, action: "Created Ticket", module: "Support", companyName: user!.companyName || "Gavit", status: "Success" });
          pushNotification({ title: "New ticket raised", message: `${t.id} - ${t.subject}`, category: "support" });
          toast.success(`Ticket ${t.id} created successfully`);
          setCreateOpen(false);
        }}
      />

      <Sheet open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {active && (
            <TicketDetail
              ticket={active}
              onStatusChange={(s) => { updateTicketStatus(active.id, s); toast.success(`Ticket marked as ${s}`); }}
              onReply={(msg) => { addTicketReply(active.id, { author: user!.name, role: user!.role, message: msg }); toast.success("Reply sent"); }}
              onEscalate={() => { updateTicketStatus(active.id, "Escalated"); pushNotification({ title: "Ticket escalated", message: `${active.id} escalated to Gavit Super Admin`, category: "support" }); toast.warning("Ticket escalated to Super Admin"); }}
              onResolve={() => { updateTicketStatus(active.id, "Resolved"); toast.success("Ticket resolved"); }}
              onClose={() => { updateTicketStatus(active.id, "Closed"); toast.success("Ticket closed"); }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CreateTicketDialog({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (d: any) => void }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Ticket["category"]>("General Support");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Raise a support ticket</DialogTitle><DialogDescription>Our HR & Gavit team will respond shortly.</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Subject *</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief title of the issue" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Payroll Issue","Attendance Issue","Leave Issue","Login / Access Problem","Technical Bug","Document Issue","Recruitment Query","General Support"] as const).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Priority</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Low","Medium","High","Critical"] as const).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Description *</Label><Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." /></div>
          <Button variant="outline" type="button" className="w-full" onClick={() => toast.info("Attachment uploaded")}><Paperclip className="h-4 w-4 mr-1.5" />Attach file</Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!subject || !description) return toast.error("Please fill all fields"); onCreate({ subject, description, category, priority }); setSubject(""); setDescription(""); }}>Submit Ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TicketDetail({ ticket, onStatusChange, onReply, onEscalate, onResolve, onClose }: { ticket: Ticket; onStatusChange: (s: TicketStatus) => void; onReply: (m: string) => void; onEscalate: () => void; onResolve: () => void; onClose: () => void }) {
  const [reply, setReply] = useState("");
  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{ticket.id}</p>
            <SheetTitle className="text-lg mt-1">{ticket.subject}</SheetTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
              <span className="text-xs text-muted-foreground">{ticket.category}</span>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-5 space-y-4">
        <div className="rounded-lg bg-secondary/50 p-3 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">Raised by</span><span className="font-semibold">{ticket.raisedBy}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-semibold">{ticket.companyName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Assigned to</span><span className="font-semibold">{ticket.assignedTo || "Unassigned"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span></div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Conversation</p>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-semibold">{ticket.raisedBy}</p>
              <p className="text-sm mt-1">{ticket.description}</p>
            </div>
            {ticket.replies.map((r) => (
              <div key={r.id} className={`rounded-lg p-3 ${r.role === "super_admin" ? "border bg-primary-soft" : "border"}`}>
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold">{r.author} <span className="font-normal text-muted-foreground">· {r.role}</span></p>
                  <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</p>
                </div>
                <p className="text-sm mt-1">{r.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." />
          <div className="flex gap-2">
            <Button onClick={() => { if (!reply.trim()) return; onReply(reply); setReply(""); }}><Send className="h-4 w-4 mr-1.5" />Send Reply</Button>
            <Button variant="outline" onClick={() => toast.info("Internal note saved (visible to support team only)")}><Lock className="h-4 w-4 mr-1.5" />Internal Note</Button>
          </div>
        </div>

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Actions</p>
          <div className="flex flex-wrap gap-2">
            <Select value={ticket.status} onValueChange={(v: any) => onStatusChange(v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            {ticket.status !== "Escalated" && <Button variant="outline" size="sm" onClick={onEscalate}><ArrowUpCircle className="h-4 w-4 mr-1.5" />Escalate</Button>}
            {ticket.status !== "Resolved" && <Button size="sm" className="bg-success hover:bg-success/90" onClick={onResolve}><CheckCircle2 className="h-4 w-4 mr-1.5" />Mark Resolved</Button>}
            {ticket.status !== "Closed" && <Button variant="outline" size="sm" onClick={onClose}>Close Ticket</Button>}
          </div>
        </div>
      </div>
    </>
  );
}
