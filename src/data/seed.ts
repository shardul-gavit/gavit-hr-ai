import type { Company, Employee, Ticket, LeaveRequest, AttendanceRecord, PayrollEntry, Invoice, Announcement, NotificationItem, Candidate, JobOpening, AuditLog } from "@/types";

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };
const daysAhead = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

export const companies: Company[] = [
  { id: "c1", name: "Tata Innovations Pvt Ltd", code: "TIN001", industry: "Technology", plan: "Enterprise", employeeCount: 248, adminName: "Rajesh Kumar", adminEmail: "rajesh@tatainnovations.in", status: "Active", expiryDate: daysAhead(120), supportHealth: "Good", createdAt: daysAgo(420), monthlyRevenue: 89000 },
  { id: "c2", name: "Infosys Digital Solutions", code: "IDS002", industry: "IT Services", plan: "Enterprise", employeeCount: 412, adminName: "Priya Sharma", adminEmail: "priya@infodigital.in", status: "Active", expiryDate: daysAhead(85), supportHealth: "Good", createdAt: daysAgo(380), monthlyRevenue: 124000 },
  { id: "c3", name: "Mahindra Logistics", code: "MHL003", industry: "Logistics", plan: "Premium", employeeCount: 156, adminName: "Arjun Patel", adminEmail: "arjun@mahindralog.in", status: "Active", expiryDate: daysAhead(45), supportHealth: "Average", createdAt: daysAgo(290), monthlyRevenue: 56000 },
  { id: "c4", name: "Reliance Retail Ventures", code: "RRV004", industry: "Retail", plan: "Growth", employeeCount: 89, adminName: "Sneha Reddy", adminEmail: "sneha@relianceretail.in", status: "Active", expiryDate: daysAhead(15), supportHealth: "Average", createdAt: daysAgo(200), monthlyRevenue: 32000 },
  { id: "c5", name: "Wipro Consulting Group", code: "WCG005", industry: "Consulting", plan: "Premium", employeeCount: 178, adminName: "Vikram Singh", adminEmail: "vikram@wiproconsult.in", status: "Active", expiryDate: daysAhead(200), supportHealth: "Good", createdAt: daysAgo(510), monthlyRevenue: 68000 },
  { id: "c6", name: "HDFC Wealth Advisors", code: "HWA006", industry: "Finance", plan: "Growth", employeeCount: 67, adminName: "Anita Desai", adminEmail: "anita@hdfcwealth.in", status: "Active", expiryDate: daysAhead(60), supportHealth: "Good", createdAt: daysAgo(180), monthlyRevenue: 28000 },
  { id: "c7", name: "Bharat Healthcare Ltd", code: "BHL007", industry: "Healthcare", plan: "Starter", employeeCount: 34, adminName: "Dr. Manoj Iyer", adminEmail: "manoj@bharathealth.in", status: "Trial", expiryDate: daysAhead(8), supportHealth: "Good", createdAt: daysAgo(22), monthlyRevenue: 0 },
  { id: "c8", name: "Maharashtra Textiles", code: "MTX008", industry: "Manufacturing", plan: "Growth", employeeCount: 124, adminName: "Suresh Joshi", adminEmail: "suresh@mhtextiles.in", status: "Suspended", expiryDate: daysAgo(12), supportHealth: "Poor", createdAt: daysAgo(340), monthlyRevenue: 0 },
  { id: "c9", name: "Bangalore Foods Co.", code: "BFC009", industry: "Food & Beverage", plan: "Starter", employeeCount: 45, adminName: "Kavya Nair", adminEmail: "kavya@bangalorefoods.in", status: "Active", expiryDate: daysAhead(-5), supportHealth: "Average", createdAt: daysAgo(150), monthlyRevenue: 18000 },
  { id: "c10", name: "Delhi EduTech Pvt Ltd", code: "DET010", industry: "Education", plan: "Premium", employeeCount: 92, adminName: "Rohit Aggarwal", adminEmail: "rohit@delhiedutech.in", status: "Active", expiryDate: daysAhead(95), supportHealth: "Good", createdAt: daysAgo(260), monthlyRevenue: 42000 },
];

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Ananya", "Aadhya", "Kiara", "Diya", "Pari", "Anika", "Navya", "Saanvi", "Riya", "Myra", "Rohan", "Karan", "Manish", "Suresh", "Deepak", "Pooja", "Neha", "Shreya", "Kavita", "Meera"];
const lastNames = ["Sharma", "Verma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Iyer", "Nair", "Joshi", "Mehta", "Agarwal", "Kapoor", "Chopra", "Malhotra", "Bhatt", "Pillai", "Rao", "Desai", "Khanna"];
const departments = ["Engineering", "Product", "Design", "Sales", "Marketing", "HR", "Finance", "Operations", "Customer Success", "Legal"];
const designations = ["Software Engineer", "Senior Engineer", "Tech Lead", "Product Manager", "Designer", "Sales Executive", "Account Manager", "HR Executive", "Finance Analyst", "Operations Lead"];

function rand<T>(a: T[]) { return a[Math.floor(Math.random() * a.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export const employees: Employee[] = Array.from({ length: 120 }).map((_, i) => {
  const fn = rand(firstNames); const ln = rand(lastNames);
  const company = rand(companies);
  return {
    id: `e${i + 1}`,
    empCode: `EMP${String(1001 + i)}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.code.toLowerCase()}.in`,
    phone: `+91 9${randInt(100000000, 999999999)}`,
    department: rand(departments),
    designation: rand(designations),
    joiningDate: daysAgo(randInt(30, 1500)),
    employmentType: rand(["Full-time", "Full-time", "Full-time", "Contract", "Intern"] as const),
    status: rand(["Active", "Active", "Active", "Active", "On Leave", "Inactive"] as const),
    companyId: company.id,
    salary: randInt(35000, 250000),
    gender: rand(["Male", "Female"] as const),
    pan: `ABCDE${randInt(1000, 9999)}F`,
    aadhaar: `${randInt(1000, 9999)} ${randInt(1000, 9999)} ${randInt(1000, 9999)}`,
  };
});

// Ensure demo employee exists for employee role
employees.unshift({
  id: "demo-emp", empCode: "EMP1000", name: "Ananya Sharma", email: "ananya@tin001.in",
  phone: "+91 9876543210", department: "Engineering", designation: "Senior Software Engineer",
  joiningDate: daysAgo(540), employmentType: "Full-time", status: "Active", companyId: "c1",
  salary: 125000, gender: "Female", pan: "ABCDE1234F", aadhaar: "1234 5678 9012",
});

const ticketSubjects = [
  ["Payroll Issue", "Salary not credited for last month"],
  ["Attendance Issue", "Wrong attendance marked on 5th"],
  ["Leave Issue", "Leave balance showing incorrect"],
  ["Login / Access Problem", "Unable to login from mobile app"],
  ["Technical Bug", "Document download fails on Chrome"],
  ["Document Issue", "Experience letter format incorrect"],
  ["Recruitment Query", "Need help posting new job"],
  ["General Support", "Request to update company logo"],
] as const;

export const tickets: Ticket[] = Array.from({ length: 28 }).map((_, i) => {
  const [cat, subj] = rand([...ticketSubjects]);
  const company = rand(companies);
  const emp = rand(employees);
  const status = rand(["Open", "Open", "In Progress", "Assigned", "Waiting for User", "Escalated", "Resolved", "Closed"] as const);
  const createdAt = daysAgo(randInt(0, 25));
  return {
    id: `TKT-${2400 + i}`,
    subject: subj,
    description: `${subj}. Please look into this at the earliest. Issue raised from ${company.name}.`,
    category: cat,
    priority: rand(["Low", "Medium", "Medium", "High", "Critical"] as const),
    status,
    raisedBy: emp.name,
    raisedByRole: rand(["employee", "hr", "company_admin"] as const),
    companyId: company.id,
    companyName: company.name,
    assignedTo: status !== "Open" ? "Gavit Support Team" : undefined,
    createdAt,
    updatedAt: daysAgo(randInt(0, 5)),
    replies: [
      { id: `r-${i}-1`, author: emp.name, role: "employee", message: "Hi team, please help resolve this. It's urgent.", createdAt },
      ...(status !== "Open" ? [{ id: `r-${i}-2`, author: "Gavit Support", role: "super_admin" as const, message: "We're looking into this and will update shortly.", createdAt: daysAgo(randInt(0, 3)) }] : []),
    ],
  };
});

export const leaveRequests: LeaveRequest[] = Array.from({ length: 18 }).map((_, i) => {
  const emp = rand(employees);
  const days = randInt(1, 5);
  const from = daysAhead(randInt(-10, 30));
  const fd = new Date(from); fd.setDate(fd.getDate() + days);
  return {
    id: `LR-${100 + i}`,
    employeeId: emp.id,
    employeeName: emp.name,
    type: rand(["Casual Leave", "Sick Leave", "Paid Leave", "Emergency Leave"] as const),
    fromDate: from,
    toDate: iso(fd),
    days,
    reason: rand(["Personal work", "Medical", "Family function", "Travel", "Festival"]),
    status: rand(["Pending", "Pending", "Approved", "Approved", "Rejected"] as const),
    appliedAt: daysAgo(randInt(0, 15)),
    companyId: emp.companyId,
  };
});

export const attendance: AttendanceRecord[] = (() => {
  const recs: AttendanceRecord[] = [];
  employees.slice(0, 40).forEach((e) => {
    for (let d = 0; d < 7; d++) {
      const status = rand(["Present", "Present", "Present", "Present", "Late", "Absent", "On Leave"] as const);
      recs.push({
        id: `att-${e.id}-${d}`,
        employeeId: e.id,
        employeeName: e.name,
        date: daysAgo(d),
        checkIn: status === "Absent" || status === "On Leave" ? undefined : `0${randInt(8, 10)}:${randInt(10, 59)}`,
        checkOut: status === "Absent" || status === "On Leave" ? undefined : `1${randInt(7, 9)}:${randInt(10, 59)}`,
        status,
        hours: status === "Present" ? randInt(8, 10) : status === "Late" ? 7 : 0,
        companyId: e.companyId,
      });
    }
  });
  return recs;
})();

export const payroll: PayrollEntry[] = employees.slice(0, 60).map((e, i) => {
  const basic = Math.round(e.salary * 0.5);
  const hra = Math.round(e.salary * 0.2);
  const allowances = Math.round(e.salary * 0.15);
  const bonus = Math.round(e.salary * 0.05);
  const pf = Math.round(basic * 0.12);
  const esic = e.salary < 25000 ? Math.round(e.salary * 0.0075) : 0;
  const tax = Math.round(e.salary * 0.08);
  const gross = basic + hra + allowances + bonus;
  const net = gross - pf - esic - tax;
  return {
    id: `pay-${i}`,
    employeeId: e.id,
    employeeName: e.name,
    month: "Mar 2025",
    basic, hra, allowances, bonus, pf, esic, tax, otherDeductions: 0, gross, net,
    status: rand(["Draft", "Pending Approval", "Approved", "Paid", "Paid"] as const),
    companyId: e.companyId,
  };
});

export const invoices: Invoice[] = companies.flatMap((c, i) => [
  { id: `INV-${2400 + i}`, companyId: c.id, companyName: c.name, plan: c.plan, amount: c.monthlyRevenue || 15000, invoiceDate: daysAgo(35), dueDate: daysAgo(5), status: c.status === "Suspended" ? "Suspended" : (i % 4 === 0 ? "Overdue" : "Paid") },
  { id: `INV-${2500 + i}`, companyId: c.id, companyName: c.name, plan: c.plan, amount: c.monthlyRevenue || 15000, invoiceDate: daysAgo(5), dueDate: daysAhead(25), status: i % 3 === 0 ? "Pending" : "Paid" },
]);

export const announcements: Announcement[] = [
  { id: "a1", title: "Holi Holiday Notice", description: "Office will remain closed on 14th March on account of Holi. Wishing everyone a colourful festival!", category: "Holiday Notice", audience: "All", publishedAt: daysAgo(3), status: "Published" },
  { id: "a2", title: "March Payroll Processed", description: "March 2025 salaries have been credited. Please check your payslips.", category: "Payroll Update", audience: "Employees", publishedAt: daysAgo(1), status: "Published" },
  { id: "a3", title: "POSH Training - Mandatory", description: "All employees must complete POSH training by 30th March.", category: "Training", audience: "All", publishedAt: daysAgo(7), status: "Published" },
  { id: "a4", title: "New Leave Policy v2.1", description: "Updated leave policy is now live. Please review the document in Knowledge Base.", category: "General", audience: "All", publishedAt: daysAgo(12), status: "Published" },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "New ticket assigned", message: "TKT-2415 from Mahindra Logistics needs attention", category: "support", read: false, createdAt: daysAgo(0) },
  { id: "n2", title: "Leave request pending", message: "Riya Mehta applied for 3 days casual leave", category: "leave", read: false, createdAt: daysAgo(0) },
  { id: "n3", title: "Payroll approved", message: "March payroll for 248 employees approved", category: "payroll", read: false, createdAt: daysAgo(1) },
  { id: "n4", title: "New announcement", message: "Holi Holiday Notice published", category: "announcement", read: true, createdAt: daysAgo(3) },
  { id: "n5", title: "Document generated", message: "Offer letter for Karan Sharma ready", category: "document", read: true, createdAt: daysAgo(2) },
];

export const candidates: Candidate[] = Array.from({ length: 18 }).map((_, i) => {
  const skills = rand([
    ["React", "TypeScript", "Node.js", "PostgreSQL"],
    ["Python", "Django", "AWS", "Docker"],
    ["Java", "Spring Boot", "Kafka", "MySQL"],
    ["Figma", "UI Design", "Prototyping"],
    ["Sales", "CRM", "Negotiation"],
  ]);
  return {
    id: `cand-${i}`,
    name: `${rand(firstNames)} ${rand(lastNames)}`,
    email: `candidate${i}@example.com`,
    jobTitle: rand(["Senior Software Engineer", "Product Designer", "Sales Manager", "DevOps Engineer", "HR Business Partner"]),
    experience: randInt(1, 12),
    skills,
    qualification: rand(["B.Tech CSE", "MCA", "MBA", "B.E. IT", "M.Tech"]),
    score: randInt(55, 96),
    status: rand(["Applied", "Screened", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"] as const),
    appliedAt: daysAgo(randInt(0, 20)),
  };
});

export const jobOpenings: JobOpening[] = [
  { id: "j1", title: "Senior Software Engineer", department: "Engineering", location: "Bangalore", type: "Full-time", openings: 3, applicants: 24, status: "Open", postedAt: daysAgo(8) },
  { id: "j2", title: "Product Designer", department: "Design", location: "Mumbai / Remote", type: "Full-time", openings: 1, applicants: 18, status: "Open", postedAt: daysAgo(15) },
  { id: "j3", title: "Sales Manager - West", department: "Sales", location: "Pune", type: "Full-time", openings: 2, applicants: 32, status: "Open", postedAt: daysAgo(20) },
  { id: "j4", title: "HR Business Partner", department: "HR", location: "Gurgaon", type: "Full-time", openings: 1, applicants: 12, status: "Closed", postedAt: daysAgo(45) },
];

export const auditLogs: AuditLog[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `log-${i}`,
  user: rand(["Rajesh Kumar", "Priya Sharma", "Gavit Admin", "Ananya Sharma", "HR System"]),
  role: rand(["super_admin", "company_admin", "hr", "employee"] as const),
  action: rand(["Created Employee", "Approved Leave", "Generated Payslip", "Suspended Company", "Closed Ticket", "Updated Invoice", "Posted Announcement", "Reset Password"]),
  module: rand(["Employees", "Leave", "Payroll", "Companies", "Support", "Billing", "Announcements", "Settings"]),
  companyName: rand(companies).name,
  status: rand(["Success", "Success", "Success", "Failed"] as const),
  createdAt: daysAgo(randInt(0, 30)),
}));
