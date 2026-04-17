import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, ROLE_HOME } from "@/store/Auth";
import { AppDataProvider } from "@/store/AppData";
import { AppShell } from "@/components/layout/AppShell";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./pages/admin/Dashboard";
import CompaniesPage from "./pages/admin/Companies";
import EmployeesPage from "./pages/shared/Employees";
import SupportCenter from "./pages/shared/SupportCenter";
import {
  LeavePage, AttendancePage, PayrollPage, BillingPage, DocumentsPage, RecruitmentPage,
  AnnouncementsPage, AuditPage, KnowledgeBasePage, SettingsPage, ReportsPage,
  ChatbotRulesPage, TemplatesPage, PlatformAnalyticsPage, CompanyReportsPage, HRReportsPage,
  HRTeamPage, CompanyAdminDashboard, HRDashboard, EmployeeDashboard, ProfilePage, NotificationsPage,
} from "./pages/shared/Modules";
import { ChatbotWidget } from "./components/chatbot/ChatbotWidget";
import type { Role } from "./types";

const queryClient = new QueryClient();

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}

function Protected({ children, allow }: { children: JSX.Element; allow?: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <AppShell>{children}</AppShell>;
}

function ChatbotPage() {
  return (
    <div className="grid place-items-center py-20">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-display font-bold mb-2">Gavit AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Tap the floating chat button at the bottom-right to start a conversation with your role-aware HR co-pilot.</p>
      </div>
      <ChatbotWidget />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppDataProvider>
          <Toaster />
          <Sonner position="top-right" richColors closeButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RoleHome />} />
              <Route path="/login" element={<Login />} />

              {/* Super Admin */}
              <Route path="/admin" element={<Protected allow={["super_admin"]}><SuperAdminDashboard /></Protected>} />
              <Route path="/admin/companies" element={<Protected allow={["super_admin"]}><CompaniesPage /></Protected>} />
              <Route path="/admin/support" element={<Protected allow={["super_admin"]}><SupportCenter scope="all" /></Protected>} />
              <Route path="/admin/billing" element={<Protected allow={["super_admin"]}><BillingPage /></Protected>} />
              <Route path="/admin/analytics" element={<Protected allow={["super_admin"]}><PlatformAnalyticsPage /></Protected>} />
              <Route path="/admin/templates" element={<Protected allow={["super_admin"]}><TemplatesPage /></Protected>} />
              <Route path="/admin/chatbot-rules" element={<Protected allow={["super_admin"]}><ChatbotRulesPage /></Protected>} />
              <Route path="/admin/announcements" element={<Protected allow={["super_admin"]}><AnnouncementsPage /></Protected>} />
              <Route path="/admin/audit" element={<Protected allow={["super_admin"]}><AuditPage /></Protected>} />
              <Route path="/admin/settings" element={<Protected allow={["super_admin"]}><SettingsPage /></Protected>} />
              <Route path="/admin/reports" element={<Protected allow={["super_admin"]}><ReportsPage /></Protected>} />

              {/* Company Admin */}
              <Route path="/company" element={<Protected allow={["company_admin"]}><CompanyAdminDashboard /></Protected>} />
              <Route path="/company/hr-team" element={<Protected allow={["company_admin"]}><HRTeamPage /></Protected>} />
              <Route path="/company/employees" element={<Protected allow={["company_admin", "hr"]}><EmployeesPage /></Protected>} />
              <Route path="/company/payroll" element={<Protected allow={["company_admin"]}><PayrollPage /></Protected>} />
              <Route path="/company/attendance" element={<Protected allow={["company_admin"]}><AttendancePage /></Protected>} />
              <Route path="/company/leave" element={<Protected allow={["company_admin"]}><LeavePage /></Protected>} />
              <Route path="/company/support" element={<Protected allow={["company_admin"]}><SupportCenter scope="company" /></Protected>} />
              <Route path="/company/reports" element={<Protected allow={["company_admin"]}><CompanyReportsPage /></Protected>} />
              <Route path="/company/announcements" element={<Protected allow={["company_admin"]}><AnnouncementsPage /></Protected>} />
              <Route path="/company/settings" element={<Protected allow={["company_admin"]}><SettingsPage /></Protected>} />

              {/* HR */}
              <Route path="/hr" element={<Protected allow={["hr"]}><HRDashboard /></Protected>} />
              <Route path="/hr/employees" element={<Protected allow={["hr"]}><EmployeesPage /></Protected>} />
              <Route path="/hr/attendance" element={<Protected allow={["hr"]}><AttendancePage /></Protected>} />
              <Route path="/hr/leave" element={<Protected allow={["hr"]}><LeavePage /></Protected>} />
              <Route path="/hr/payroll" element={<Protected allow={["hr"]}><PayrollPage /></Protected>} />
              <Route path="/hr/documents" element={<Protected allow={["hr"]}><DocumentsPage /></Protected>} />
              <Route path="/hr/recruitment" element={<Protected allow={["hr"]}><RecruitmentPage /></Protected>} />
              <Route path="/hr/support" element={<Protected allow={["hr"]}><SupportCenter scope="company" /></Protected>} />
              <Route path="/hr/reports" element={<Protected allow={["hr"]}><HRReportsPage /></Protected>} />
              <Route path="/hr/kb" element={<Protected allow={["hr"]}><KnowledgeBasePage /></Protected>} />

              {/* Employee */}
              <Route path="/me" element={<Protected allow={["employee"]}><EmployeeDashboard /></Protected>} />
              <Route path="/me/attendance" element={<Protected allow={["employee"]}><AttendancePage scope="mine" /></Protected>} />
              <Route path="/me/leave" element={<Protected allow={["employee"]}><LeavePage scope="mine" /></Protected>} />
              <Route path="/me/payroll" element={<Protected allow={["employee"]}><PayrollPage scope="mine" /></Protected>} />
              <Route path="/me/documents" element={<Protected allow={["employee"]}><DocumentsPage /></Protected>} />
              <Route path="/me/support" element={<Protected allow={["employee"]}><SupportCenter scope="mine" /></Protected>} />
              <Route path="/me/chatbot" element={<Protected allow={["employee"]}><ChatbotPage /></Protected>} />
              <Route path="/me/announcements" element={<Protected allow={["employee"]}><NotificationsPage /></Protected>} />
              <Route path="/me/profile" element={<Protected allow={["employee"]}><ProfilePage /></Protected>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
