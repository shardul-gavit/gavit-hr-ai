import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/store/Auth";
import { useAppData } from "@/store/AppData";
import { generateReply, getGreeting, getQuickActions, intentToText } from "@/lib/chatbot";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ChatbotWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tickets, leaves, payroll, companies, invoices } = useAppData();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0 && user) {
      setMessages([{ id: "init", role: "bot", content: getGreeting(user.role), timestamp: new Date().toISOString() }]);
    }
  }, [open, user, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!user) return null;

  const ctx = {
    role: user.role,
    userName: user.name,
    data: {
      pendingLeaves: leaves.filter((l) => l.status === "Pending").length,
      payrollPending: payroll.filter((p) => p.status === "Pending Approval").length,
      openTickets: tickets.filter((t) => ["Open", "In Progress", "Assigned"].includes(t.status)).length,
      totalCompanies: companies.length,
      overdueCompanies: invoices.filter((i) => i.status === "Overdue").length,
      escalatedTickets: tickets.filter((t) => t.status === "Escalated").length,
      monthlyRevenue: companies.reduce((s, c) => s + c.monthlyRevenue, 0),
      presentToday: 218, absentToday: 12,
    },
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = generateReply(text, ctx);
      const botMsg: ChatMessage = { id: `b-${Date.now()}`, role: "bot", content: reply.content, timestamp: new Date().toISOString(), card: reply.card, actions: reply.actions };
      setMessages((p) => [...p, botMsg]);
    }, 450);
  };

  const handleAction = (intent: string) => {
    const navMap: Record<string, string> = {
      apply_leave: user.role === "employee" ? "/me/leave" : "/hr/leave",
      leave_history: "/me/leave",
      view_attendance: "/me/attendance",
      view_attendance_hr: "/hr/attendance",
      open_leaves: "/hr/leave",
      open_payroll: "/hr/payroll",
      open_escalated: "/admin/support",
      open_billing: "/admin/billing",
      open_companies: "/admin/companies",
      download_payslip: "/me/payroll",
    };
    if (navMap[intent]) {
      navigate(navMap[intent]);
      setOpen(false);
      toast.success("Opening page...");
      return;
    }
    if (intent.startsWith("ticket_")) {
      navigate(user.role === "employee" ? "/me/support" : "/hr/support");
      setOpen(false);
      toast.info("Opening support center to raise your ticket");
      return;
    }
    if (intent === "raise_payroll_ticket") {
      navigate(user.role === "employee" ? "/me/support" : "/hr/support");
      setOpen(false);
      toast.info("Opening support to raise payroll ticket");
      return;
    }
    if (intent === "approve_payroll") {
      toast.success("All pending payroll items approved");
      return;
    }
    if (intent === "send_reminders") {
      toast.success("Payment reminders sent to 3 companies");
      return;
    }
    send(intentToText(intent));
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full gradient-primary shadow-glow grid place-items-center text-white hover:scale-105 transition-transform"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent grid place-items-center">
            <Sparkles className="h-2.5 w-2.5 text-accent-foreground" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-3rem)] bg-card border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden animate-in-up">
          <div className="px-4 py-3 border-b bg-gradient-to-r from-primary to-primary-glow text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur grid place-items-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Gavit AI Assistant</p>
                <p className="text-[11px] text-white/80">Smart HR co-pilot · Always on</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/20 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as any}>
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "bot" && <div className="h-7 w-7 rounded-full gradient-primary grid place-items-center shrink-0"><Bot className="h-4 w-4 text-white" /></div>}
                  <div className={cn("max-w-[80%] space-y-2", m.role === "user" && "items-end")}>
                    <div className={cn("rounded-2xl px-3.5 py-2 text-sm", m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary rounded-tl-sm")}>
                      {m.content}
                    </div>
                    {m.card && (
                      <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="px-3 py-2 bg-primary-soft border-b">
                          <p className="text-xs font-semibold text-primary">{m.card.title}</p>
                        </div>
                        <div className="p-3 space-y-1.5">
                          {m.card.rows.map((r, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{r.label}</span>
                              <span className="font-semibold text-foreground">{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {m.actions && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.actions.map((a, i) => (
                          <button key={i} onClick={() => handleAction(a.intent)} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {m.role === "user" && <div className="h-7 w-7 rounded-full bg-secondary grid place-items-center shrink-0"><UserIcon className="h-4 w-4" /></div>}
                </div>
              ))}
            </div>
          </ScrollArea>

          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Quick actions</p>
              <div className="flex flex-wrap gap-1.5">
                {getQuickActions(user.role).map((a, i) => (
                  <button key={i} onClick={() => handleAction(a.intent)} className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary hover:bg-primary-soft hover:border-primary/30 hover:text-primary transition-colors font-medium">
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="h-9 bg-secondary border-0" />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
