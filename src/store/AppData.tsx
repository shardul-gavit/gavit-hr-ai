import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { companies as seedCompanies, employees as seedEmployees, tickets as seedTickets, leaveRequests as seedLeaves, attendance as seedAttendance, payroll as seedPayroll, invoices as seedInvoices, announcements as seedAnnouncements, notifications as seedNotifications, candidates as seedCandidates, jobOpenings as seedJobs, auditLogs as seedAudit } from "@/data/seed";
import type { Company, Employee, Ticket, LeaveRequest, AttendanceRecord, PayrollEntry, Invoice, Announcement, NotificationItem, Candidate, JobOpening, AuditLog, TicketStatus, TicketReply, Role } from "@/types";

interface AppDataState {
  companies: Company[];
  employees: Employee[];
  tickets: Ticket[];
  leaves: LeaveRequest[];
  attendance: AttendanceRecord[];
  payroll: PayrollEntry[];
  invoices: Invoice[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  candidates: Candidate[];
  jobs: JobOpening[];
  audit: AuditLog[];

  addCompany: (c: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;

  addEmployee: (e: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "replies">) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketReply: (id: string, reply: Omit<TicketReply, "id" | "createdAt">) => void;

  addLeave: (l: Omit<LeaveRequest, "id" | "appliedAt">) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest["status"]) => void;

  toggleAttendance: (employeeId: string, employeeName: string, companyId: string) => "in" | "out";
  todayAttendance: (employeeId: string) => AttendanceRecord | undefined;

  updatePayrollStatus: (id: string, status: PayrollEntry["status"]) => void;
  runPayroll: () => void;

  addInvoice: (i: Omit<Invoice, "id">) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;

  addAnnouncement: (a: Omit<Announcement, "id" | "publishedAt">) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;

  updateCandidateStatus: (id: string, status: Candidate["status"]) => void;
  addJob: (j: Omit<JobOpening, "id" | "postedAt" | "applicants">) => void;

  pushAudit: (a: Omit<AuditLog, "id" | "createdAt">) => void;
}

const AppDataContext = createContext<AppDataState | null>(null);

const todayIso = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState(seedCompanies);
  const [employees, setEmployees] = useState(seedEmployees);
  const [tickets, setTickets] = useState(seedTickets);
  const [leaves, setLeaves] = useState(seedLeaves);
  const [attendance, setAttendance] = useState(seedAttendance);
  const [payroll, setPayroll] = useState(seedPayroll);
  const [invoices, setInvoices] = useState(seedInvoices);
  const [announcements, setAnnouncements] = useState(seedAnnouncements);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [jobs, setJobs] = useState(seedJobs);
  const [audit, setAudit] = useState(seedAudit);

  const addCompany: AppDataState["addCompany"] = useCallback((c) => {
    const newC: Company = { ...c, id: `c${Date.now()}`, createdAt: todayIso() };
    setCompanies((p) => [newC, ...p]);
  }, []);
  const updateCompany: AppDataState["updateCompany"] = useCallback((id, patch) => {
    setCompanies((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addEmployee: AppDataState["addEmployee"] = useCallback((e) => {
    const newE: Employee = { ...e, id: `e${Date.now()}` };
    setEmployees((p) => [newE, ...p]);
  }, []);
  const updateEmployee: AppDataState["updateEmployee"] = useCallback((id, patch) => {
    setEmployees((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);
  const deleteEmployee: AppDataState["deleteEmployee"] = useCallback((id) => {
    setEmployees((p) => p.filter((e) => e.id !== id));
  }, []);

  const addTicket: AppDataState["addTicket"] = useCallback((t) => {
    const newT: Ticket = { ...t, id: `TKT-${Math.floor(Math.random() * 9000) + 3000}`, createdAt: nowIso(), updatedAt: nowIso(), replies: [] };
    setTickets((p) => [newT, ...p]);
    return newT;
  }, []);
  const updateTicketStatus: AppDataState["updateTicketStatus"] = useCallback((id, status) => {
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, status, updatedAt: nowIso() } : t)));
  }, []);
  const addTicketReply: AppDataState["addTicketReply"] = useCallback((id, reply) => {
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, replies: [...t.replies, { ...reply, id: `r-${Date.now()}`, createdAt: nowIso() }], updatedAt: nowIso() } : t)));
  }, []);

  const addLeave: AppDataState["addLeave"] = useCallback((l) => {
    const newL: LeaveRequest = { ...l, id: `LR-${Math.floor(Math.random() * 900) + 200}`, appliedAt: todayIso() };
    setLeaves((p) => [newL, ...p]);
  }, []);
  const updateLeaveStatus: AppDataState["updateLeaveStatus"] = useCallback((id, status) => {
    setLeaves((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const todayAttendance: AppDataState["todayAttendance"] = useCallback((employeeId) => {
    return attendance.find((a) => a.employeeId === employeeId && a.date === todayIso());
  }, [attendance]);

  const toggleAttendance: AppDataState["toggleAttendance"] = useCallback((employeeId, employeeName, companyId) => {
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === todayIso());
    const time = new Date().toTimeString().slice(0, 5);
    if (!existing) {
      setAttendance((p) => [{ id: `att-${Date.now()}`, employeeId, employeeName, date: todayIso(), checkIn: time, status: "Present", hours: 0, companyId }, ...p]);
      return "in";
    } else if (!existing.checkOut) {
      const [h, m] = (existing.checkIn || "09:00").split(":").map(Number);
      const hours = Math.max(1, new Date().getHours() - h + (new Date().getMinutes() - m) / 60);
      setAttendance((p) => p.map((a) => (a.id === existing.id ? { ...a, checkOut: time, hours: Math.round(hours * 10) / 10 } : a)));
      return "out";
    } else {
      setAttendance((p) => p.map((a) => (a.id === existing.id ? { ...a, checkIn: time, checkOut: undefined, hours: 0 } : a)));
      return "in";
    }
  }, [attendance]);

  const updatePayrollStatus: AppDataState["updatePayrollStatus"] = useCallback((id, status) => {
    setPayroll((p) => p.map((e) => (e.id === id ? { ...e, status } : e)));
  }, []);
  const runPayroll = useCallback(() => {
    setPayroll((p) => p.map((e) => (e.status === "Draft" ? { ...e, status: "Pending Approval" } : e)));
  }, []);

  const addInvoice: AppDataState["addInvoice"] = useCallback((i) => {
    setInvoices((p) => [{ ...i, id: `INV-${Math.floor(Math.random() * 9000) + 3000}` }, ...p]);
  }, []);
  const updateInvoice: AppDataState["updateInvoice"] = useCallback((id, patch) => {
    setInvoices((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const addAnnouncement: AppDataState["addAnnouncement"] = useCallback((a) => {
    setAnnouncements((p) => [{ ...a, id: `a${Date.now()}`, publishedAt: todayIso() }, ...p]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  }, []);
  const pushNotification: AppDataState["pushNotification"] = useCallback((n) => {
    setNotifications((p) => [{ ...n, id: `n${Date.now()}`, createdAt: nowIso(), read: false }, ...p]);
  }, []);

  const updateCandidateStatus: AppDataState["updateCandidateStatus"] = useCallback((id, status) => {
    setCandidates((p) => p.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);
  const addJob: AppDataState["addJob"] = useCallback((j) => {
    setJobs((p) => [{ ...j, id: `j${Date.now()}`, postedAt: todayIso(), applicants: 0 }, ...p]);
  }, []);

  const pushAudit: AppDataState["pushAudit"] = useCallback((a) => {
    setAudit((p) => [{ ...a, id: `log-${Date.now()}`, createdAt: nowIso() }, ...p]);
  }, []);

  return (
    <AppDataContext.Provider value={{
      companies, employees, tickets, leaves, attendance, payroll, invoices, announcements, notifications, candidates, jobs, audit,
      addCompany, updateCompany,
      addEmployee, updateEmployee, deleteEmployee,
      addTicket, updateTicketStatus, addTicketReply,
      addLeave, updateLeaveStatus,
      toggleAttendance, todayAttendance,
      updatePayrollStatus, runPayroll,
      addInvoice, updateInvoice,
      addAnnouncement,
      markNotificationRead, markAllNotificationsRead, pushNotification,
      updateCandidateStatus, addJob,
      pushAudit,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
