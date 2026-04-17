import type { Role, ChatMessage } from "@/types";

interface BotContext {
  role: Role;
  userName: string;
  // demo data slices the bot can read
  data: {
    leaveBalance?: number;
    pendingLeaves?: number;
    presentToday?: number;
    absentToday?: number;
    payrollPending?: number;
    openTickets?: number;
    totalCompanies?: number;
    overdueCompanies?: number;
    escalatedTickets?: number;
    monthlyRevenue?: number;
    nextPayDate?: string;
    lastPayslipAmount?: number;
  };
}

export interface BotReply {
  content: string;
  card?: ChatMessage["card"];
  actions?: ChatMessage["actions"];
}

const intents: { match: RegExp; roles: Role[]; reply: (ctx: BotContext) => BotReply }[] = [
  // Employee
  {
    match: /(leave balance|how many leaves|leaves left)/i,
    roles: ["employee"],
    reply: (ctx) => ({
      content: `Here's your current leave balance, ${ctx.userName.split(" ")[0]}:`,
      card: { title: "Leave Balance · FY 2024-25", rows: [
        { label: "Casual Leave", value: "8 / 12 days" },
        { label: "Sick Leave", value: "5 / 8 days" },
        { label: "Paid Leave", value: "10 / 15 days" },
        { label: "Used this year", value: "12 days" },
      ]},
      actions: [{ label: "Apply Leave", intent: "apply_leave" }, { label: "View History", intent: "leave_history" }],
    }),
  },
  {
    match: /(salary|payslip|salary not credited|salary status)/i,
    roles: ["employee"],
    reply: (ctx) => ({
      content: ctx.role === "employee" && /not credited|missing|delayed/i.test("") ? "I see you're asking about salary status." : "Here's your latest salary status:",
      card: { title: "March 2025 Payslip", rows: [
        { label: "Gross Salary", value: "₹1,25,000" },
        { label: "Deductions", value: "₹18,500" },
        { label: "Net Paid", value: "₹1,06,500" },
        { label: "Credited On", value: "28 Mar 2025" },
        { label: "Status", value: "Paid" },
      ]},
      actions: [{ label: "Download Payslip", intent: "download_payslip" }, { label: "Raise Payroll Ticket", intent: "raise_payroll_ticket" }],
    }),
  },
  {
    match: /(attendance|present|check.?in)/i,
    roles: ["employee"],
    reply: () => ({
      content: "Here's your attendance for this month:",
      card: { title: "March Attendance", rows: [
        { label: "Present Days", value: "21" },
        { label: "Absent", value: "1" },
        { label: "Late Marks", value: "2" },
        { label: "Avg. Working Hours", value: "8.6 hrs" },
      ]},
      actions: [{ label: "View Full Report", intent: "view_attendance" }],
    }),
  },
  {
    match: /(holiday|leave list|holiday list)/i,
    roles: ["employee", "hr", "company_admin"],
    reply: () => ({
      content: "Upcoming Indian holidays for 2025:",
      card: { title: "Upcoming Holidays", rows: [
        { label: "14 Mar (Fri)", value: "Holi" },
        { label: "31 Mar (Mon)", value: "Eid-ul-Fitr" },
        { label: "10 Apr (Thu)", value: "Mahavir Jayanti" },
        { label: "18 Apr (Fri)", value: "Good Friday" },
        { label: "01 May (Thu)", value: "Labour Day" },
      ]},
    }),
  },
  // HR
  {
    match: /(pending leaves|leave approvals|approval)/i,
    roles: ["hr", "company_admin"],
    reply: (ctx) => ({
      content: `You have ${ctx.data.pendingLeaves || 6} pending leave requests waiting for your approval.`,
      actions: [{ label: "Open Leave Requests", intent: "open_leaves" }],
    }),
  },
  {
    match: /(payroll status|payroll|run payroll)/i,
    roles: ["hr", "company_admin"],
    reply: (ctx) => ({
      content: "Here's the current payroll status for March 2025:",
      card: { title: "Payroll Run · March 2025", rows: [
        { label: "Total Employees", value: "248" },
        { label: "Processed", value: "242" },
        { label: "Pending Approval", value: `${ctx.data.payrollPending || 6}` },
        { label: "Total Payout", value: "₹2.84 Cr" },
      ]},
      actions: [{ label: "Open Payroll", intent: "open_payroll" }, { label: "Approve All", intent: "approve_payroll" }],
    }),
  },
  {
    match: /(absent|today.*attendance|attendance.*today)/i,
    roles: ["hr", "company_admin"],
    reply: (ctx) => ({
      content: `Today's attendance summary:`,
      card: { title: "Today's Attendance", rows: [
        { label: "Present", value: `${ctx.data.presentToday || 218}` },
        { label: "Absent", value: `${ctx.data.absentToday || 12}` },
        { label: "On Leave", value: "8" },
        { label: "Late", value: "10" },
      ]},
      actions: [{ label: "View Attendance", intent: "view_attendance_hr" }],
    }),
  },
  // Super Admin
  {
    match: /(escalat|high priority)/i,
    roles: ["super_admin"],
    reply: (ctx) => ({
      content: `${ctx.data.escalatedTickets || 4} tickets are currently escalated and need your attention.`,
      actions: [{ label: "Open Escalated Tickets", intent: "open_escalated" }],
    }),
  },
  {
    match: /(overdue|payment.*pending|companies.*overdue)/i,
    roles: ["super_admin"],
    reply: (ctx) => ({
      content: `${ctx.data.overdueCompanies || 3} companies have overdue invoices:`,
      card: { title: "Overdue Companies", rows: [
        { label: "Mahindra Logistics", value: "₹56,000 · 12d overdue" },
        { label: "Bangalore Foods Co.", value: "₹18,000 · 5d overdue" },
        { label: "Reliance Retail", value: "₹32,000 · 2d overdue" },
      ]},
      actions: [{ label: "Send Reminders", intent: "send_reminders" }, { label: "Open Billing", intent: "open_billing" }],
    }),
  },
  {
    match: /(revenue|monthly revenue|earning)/i,
    roles: ["super_admin"],
    reply: (ctx) => ({
      content: "Platform revenue snapshot:",
      card: { title: "Revenue · March 2025", rows: [
        { label: "Monthly Revenue", value: `₹${((ctx.data.monthlyRevenue || 457000) / 100000).toFixed(2)} L` },
        { label: "Active Subscriptions", value: "9" },
        { label: "MRR Growth", value: "+12.4%" },
        { label: "Outstanding", value: "₹1.06 L" },
      ]},
    }),
  },
  {
    match: /(company status|companies|platform)/i,
    roles: ["super_admin"],
    reply: (ctx) => ({
      content: "Platform-wide company status:",
      card: { title: "Companies", rows: [
        { label: "Total", value: `${ctx.data.totalCompanies || 10}` },
        { label: "Active", value: "8" },
        { label: "Trial", value: "1" },
        { label: "Suspended", value: "1" },
      ]},
      actions: [{ label: "Manage Companies", intent: "open_companies" }],
    }),
  },
  // Common
  {
    match: /(ticket|support|help|raise|complain)/i,
    roles: ["super_admin", "company_admin", "hr", "employee"],
    reply: () => ({
      content: "I can help you raise a support ticket. What's the issue category?",
      actions: [
        { label: "Payroll Issue", intent: "ticket_payroll" },
        { label: "Attendance Issue", intent: "ticket_attendance" },
        { label: "Leave Issue", intent: "ticket_leave" },
        { label: "Other", intent: "ticket_general" },
      ],
    }),
  },
  {
    match: /(policy|hr policy|leave policy|rules)/i,
    roles: ["employee", "hr"],
    reply: () => ({
      content: "Here are the most-asked HR policies. Open Knowledge Base for the full library.",
      card: { title: "HR Policies", rows: [
        { label: "Leave Policy v2.1", value: "Updated 12 Mar" },
        { label: "Code of Conduct", value: "v1.8" },
        { label: "POSH Guidelines", value: "Mandatory" },
        { label: "Work From Home", value: "Hybrid 3+2" },
      ]},
    }),
  },
];

const greetings: Record<Role, string> = {
  super_admin: "Hi! I'm your Gavit AI Assistant. I can show platform health, escalated tickets, overdue companies and more.",
  company_admin: "Hi! I can help with HR operations, payroll status, attendance and pending approvals.",
  hr: "Hi! I'm your HR co-pilot. Ask me about pending leaves, payroll, attendance or employee queries.",
  employee: "Hi! I'm your HR assistant. I can check your salary, leave balance, attendance, payslips and raise tickets.",
};

const quickActions: Record<Role, { label: string; intent: string }[]> = {
  super_admin: [
    { label: "Escalated Tickets", intent: "show_escalated" },
    { label: "Overdue Companies", intent: "show_overdue" },
    { label: "Platform Revenue", intent: "show_revenue" },
    { label: "Company Status", intent: "show_companies" },
  ],
  company_admin: [
    { label: "Pending Leaves", intent: "show_pending_leaves" },
    { label: "Payroll Status", intent: "show_payroll" },
    { label: "Today's Attendance", intent: "show_attendance" },
    { label: "Open Tickets", intent: "show_tickets" },
  ],
  hr: [
    { label: "Pending Leaves", intent: "show_pending_leaves" },
    { label: "Payroll Status", intent: "show_payroll" },
    { label: "Today's Attendance", intent: "show_attendance" },
    { label: "Resolve Queries", intent: "show_tickets" },
  ],
  employee: [
    { label: "My Payslip", intent: "show_payslip" },
    { label: "Leave Balance", intent: "show_leave" },
    { label: "My Attendance", intent: "show_attendance" },
    { label: "Raise Query", intent: "raise_ticket" },
  ],
};

const intentMap: Record<string, string> = {
  show_escalated: "escalated tickets",
  show_overdue: "overdue companies",
  show_revenue: "monthly revenue",
  show_companies: "company status",
  show_pending_leaves: "pending leave approvals",
  show_payroll: "payroll status",
  show_attendance: "today's attendance",
  show_tickets: "open support tickets",
  show_payslip: "my salary",
  show_leave: "leave balance",
  raise_ticket: "raise a support ticket",
};

export function getGreeting(role: Role): string { return greetings[role]; }
export function getQuickActions(role: Role) { return quickActions[role]; }
export function intentToText(intent: string): string { return intentMap[intent] || intent; }

export function generateReply(input: string, ctx: BotContext): BotReply {
  const text = input.trim();
  if (!text) return { content: "Please type a message." };
  const matched = intents.find((i) => i.roles.includes(ctx.role) && i.match.test(text));
  if (matched) return matched.reply(ctx);

  return {
    content: `I'm not sure I understood "${text}". Try one of the suggestions below:`,
    actions: quickActions[ctx.role].slice(0, 3),
  };
}
