import { useMemo, useState } from "react";
import { useAppData } from "@/store/AppData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, AlertTriangle, LifeBuoy, IndianRupee, AlertCircle, Activity, Plus, Send, Megaphone, Bot } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, subMonths } from "date-fns";

const monthsData = Array.from({ length: 8 }).map((_, i) => {
  const d = subMonths(new Date(), 7 - i);
  return {
    month: format(d, "MMM"),
    companies: 4 + i + Math.floor(Math.random() * 2),
    revenue: 180 + i * 32 + Math.floor(Math.random() * 30),
    tickets: 18 + Math.floor(Math.random() * 12),
    resolved: 14 + Math.floor(Math.random() * 10),
  };
});

export default function SuperAdminDashboard() {
  const { companies, employees, tickets, invoices, addAnnouncement, pushNotification } = useAppData();
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: companies.length,
    active: companies.filter((c) => c.status === "Active").length,
    suspended: companies.filter((c) => c.status === "Suspended").length,
    employees: employees.length + 950, // platform-wide
    pendingTickets: tickets.filter((t) => ["Open", "Assigned", "In Progress"].includes(t.status)).length,
    escalated: tickets.filter((t) => t.status === "Escalated").length,
    revenue: companies.reduce((s, c) => s + c.monthlyRevenue, 0),
    overdue: invoices.filter((i) => i.status === "Overdue").length,
  }), [companies, employees, tickets, invoices]);

  const recentTickets = tickets.slice(0, 5);
  const recentCompanies = [...companies].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const overdueCompanies = invoices.filter((i) => i.status === "Overdue").slice(0, 4);

  return (
    <>
      <PageHeader
        title="Platform Command Center"
        description="Master view of every company, ticket, invoice & escalation across Gavit HR AI."
        actions={
          <>
            <Button variant="outline" onClick={() => { toast.success("Announcement broadcast to all companies"); pushNotification({ title: "Platform announcement sent", message: "Broadcast delivered to all 10 companies", category: "announcement" }); }}>
              <Megaphone className="h-4 w-4 mr-1.5" /> Broadcast
            </Button>
            <Button onClick={() => navigate("/admin/companies")}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Company
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Companies" value={stats.total} icon={Building2} tone="primary" trend={{ value: 12.5 }} hint="+1 this month" />
        <StatCard label="Active" value={stats.active} icon={Activity} tone="success" hint="Healthy operations" />
        <StatCard label="Suspended" value={stats.suspended} icon={AlertTriangle} tone="destructive" hint="Action required" />
        <StatCard label="Total Employees" value={`${(stats.employees / 1000).toFixed(1)}K`} icon={Users} tone="info" trend={{ value: 8.2 }} />
        <StatCard label="Pending Tickets" value={stats.pendingTickets} icon={LifeBuoy} tone="warning" onClick={() => navigate("/admin/support")} />
        <StatCard label="Escalated" value={stats.escalated} icon={AlertCircle} tone="destructive" onClick={() => navigate("/admin/support")} />
        <StatCard label="Monthly Revenue" value={`₹${(stats.revenue / 100000).toFixed(2)}L`} icon={IndianRupee} tone="success" trend={{ value: 14.3 }} />
        <StatCard label="Overdue Payments" value={stats.overdue} icon={AlertCircle} tone="warning" onClick={() => navigate("/admin/billing")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-display">Revenue & Company Growth</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Last 8 months</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthsData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" name="Revenue (₹k)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Ticket Resolution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Bar dataKey="resolved" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-display">Recent Support Tickets</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate("/admin/support")}>View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentTickets.map((t) => (
                <button key={t.id} onClick={() => navigate("/admin/support")} className="w-full text-left px-5 py-3 hover:bg-secondary/40 transition-colors flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary grid place-items-center text-xs font-bold">{t.id.slice(-3)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.companyName} · {t.raisedBy}</p>
                  </div>
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base font-display">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/admin/companies")}><Plus className="h-4 w-4 mr-2" />Add Company</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/admin/billing")}><IndianRupee className="h-4 w-4 mr-2" />Create Invoice</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { toast.success("Reminders sent to overdue companies"); }}><Send className="h-4 w-4 mr-2" />Send Reminders</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/admin/chatbot-rules")}><Bot className="h-4 w-4 mr-2" />Update Chatbot Rule</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-display">Overdue Payments</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {overdueCompanies.map((i) => (
                  <div key={i.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{i.companyName}</p>
                      <p className="text-xs text-muted-foreground">₹{i.amount.toLocaleString("en-IN")} · {i.id}</p>
                    </div>
                    <StatusBadge status="Overdue" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
