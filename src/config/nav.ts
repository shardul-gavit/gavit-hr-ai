import {
  LayoutDashboard, Building2, LifeBuoy, Receipt, BarChart3, FileText, Bot, Megaphone, ScrollText, Settings,
  Users, CalendarClock, CalendarDays, Wallet, Briefcase, BookOpen, ClipboardList, UserCog, MessageCircle, Bell, User, FileSpreadsheet, ListChecks
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem { label: string; to: string; icon: any; }
export interface NavGroup { label?: string; items: NavItem[]; }

export const NAV: Record<Role, NavGroup[]> = {
  super_admin: [
    {
      label: "Platform",
      items: [
        { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
        { label: "Companies", to: "/admin/companies", icon: Building2 },
        { label: "Support Center", to: "/admin/support", icon: LifeBuoy },
        { label: "Subscriptions", to: "/admin/billing", icon: Receipt },
        { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Operations",
      items: [
        { label: "Templates", to: "/admin/templates", icon: FileText },
        { label: "Chatbot Rules", to: "/admin/chatbot-rules", icon: Bot },
        { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
        { label: "Audit Logs", to: "/admin/audit", icon: ScrollText },
        { label: "Settings", to: "/admin/settings", icon: Settings },
      ],
    },
  ],
  company_admin: [
    {
      items: [
        { label: "Dashboard", to: "/company", icon: LayoutDashboard },
        { label: "HR Team", to: "/company/hr-team", icon: UserCog },
        { label: "Employees", to: "/company/employees", icon: Users },
        { label: "Payroll", to: "/company/payroll", icon: Wallet },
        { label: "Attendance", to: "/company/attendance", icon: CalendarClock },
        { label: "Leave", to: "/company/leave", icon: CalendarDays },
        { label: "Support", to: "/company/support", icon: LifeBuoy },
        { label: "Reports", to: "/company/reports", icon: BarChart3 },
        { label: "Announcements", to: "/company/announcements", icon: Megaphone },
        { label: "Settings", to: "/company/settings", icon: Settings },
      ],
    },
  ],
  hr: [
    {
      items: [
        { label: "Dashboard", to: "/hr", icon: LayoutDashboard },
        { label: "Employees", to: "/hr/employees", icon: Users },
        { label: "Attendance", to: "/hr/attendance", icon: CalendarClock },
        { label: "Leave Requests", to: "/hr/leave", icon: CalendarDays },
        { label: "Payroll", to: "/hr/payroll", icon: Wallet },
        { label: "Documents", to: "/hr/documents", icon: FileText },
        { label: "Recruitment", to: "/hr/recruitment", icon: Briefcase },
        { label: "Support Inbox", to: "/hr/support", icon: LifeBuoy },
        { label: "Reports", to: "/hr/reports", icon: FileSpreadsheet },
        { label: "Knowledge Base", to: "/hr/kb", icon: BookOpen },
      ],
    },
  ],
  employee: [
    {
      items: [
        { label: "Dashboard", to: "/me", icon: LayoutDashboard },
        { label: "My Attendance", to: "/me/attendance", icon: CalendarClock },
        { label: "My Leave", to: "/me/leave", icon: CalendarDays },
        { label: "My Payroll", to: "/me/payroll", icon: Wallet },
        { label: "My Documents", to: "/me/documents", icon: FileText },
        { label: "Support / Help", to: "/me/support", icon: LifeBuoy },
        { label: "Chatbot", to: "/me/chatbot", icon: MessageCircle },
        { label: "Announcements", to: "/me/announcements", icon: Megaphone },
        { label: "Profile", to: "/me/profile", icon: User },
      ],
    },
  ],
};
