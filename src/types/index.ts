export type Role = "super_admin" | "company_admin" | "hr" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  designation?: string;
  department?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  industry: string;
  plan: "Starter" | "Growth" | "Premium" | "Enterprise";
  employeeCount: number;
  adminName: string;
  adminEmail: string;
  status: "Active" | "Suspended" | "Trial" | "Pending";
  expiryDate: string;
  supportHealth: "Good" | "Average" | "Poor";
  createdAt: string;
  monthlyRevenue: number;
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  status: "Active" | "Inactive" | "On Leave";
  companyId: string;
  salary: number;
  manager?: string;
  gender?: "Male" | "Female" | "Other";
  pan?: string;
  aadhaar?: string;
}

export type TicketStatus = "Open" | "Assigned" | "In Progress" | "Waiting for User" | "Escalated" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export interface TicketReply {
  id: string;
  author: string;
  role: Role;
  message: string;
  createdAt: string;
  internal?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: "Payroll Issue" | "Attendance Issue" | "Leave Issue" | "Login / Access Problem" | "Technical Bug" | "Document Issue" | "Recruitment Query" | "General Support";
  priority: TicketPriority;
  status: TicketStatus;
  raisedBy: string;
  raisedByRole: Role;
  companyId: string;
  companyName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Casual Leave" | "Sick Leave" | "Paid Leave" | "Unpaid Leave" | "Maternity Leave" | "Emergency Leave";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedAt: string;
  companyId: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Late" | "Half Day" | "On Leave" | "Holiday";
  hours?: number;
  companyId: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  pf: number;
  esic: number;
  tax: number;
  otherDeductions: number;
  gross: number;
  net: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid";
  companyId: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  companyName: string;
  plan: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Suspended";
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: "General" | "Holiday Notice" | "Payroll Update" | "Training" | "Urgent";
  audience: "All" | "HR" | "Employees" | "Admins";
  publishedAt: string;
  status: "Published" | "Draft" | "Archived";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "payroll" | "leave" | "support" | "announcement" | "system" | "onboarding" | "document";
  read: boolean;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  experience: number;
  skills: string[];
  qualification: string;
  score: number;
  status: "Applied" | "Screened" | "Shortlisted" | "Interview Scheduled" | "Selected" | "Rejected";
  appliedAt: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  openings: number;
  applicants: number;
  status: "Open" | "Closed" | "Draft";
  postedAt: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  module: string;
  companyName: string;
  status: "Success" | "Failed";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
  card?: { title: string; rows: { label: string; value: string }[] };
  actions?: { label: string; intent: string }[];
}
