import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, ROLE_LABEL } from "@/store/Auth";
import { NAV } from "@/config/nav";
import { useAppData } from "@/store/AppData";
import { Sparkles, Search, Bell, LogOut, Menu, X, Settings, User, ChevronDown, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { formatDistanceToNow } from "date-fns";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <>{children}</>;
  const groups = NAV[user.role];
  const unread = notifications.filter((n) => !n.read).length;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-sidebar-primary-foreground leading-none">Gavit HR <span className="text-sidebar-primary">AI</span></p>
            <p className="text-[10px] text-sidebar-foreground/60 mt-1">by Gavit E-Services</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        {groups.map((g, gi) => (
          <div key={gi} className="mb-5">
            {g.label && <p className="px-2 mb-2 text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/50">{g.label}</p>}
            <nav className="space-y-0.5">
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/${user.role === 'super_admin' ? 'admin' : user.role === 'company_admin' ? 'company' : user.role === 'hr' ? 'hr' : 'me'}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </ScrollArea>
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-xl bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-sidebar-primary-foreground">{user.name}</p>
          <p className="text-[11px] text-sidebar-foreground/70 mt-0.5">{ROLE_LABEL[user.role]}</p>
          {user.companyName && <p className="text-[10px] text-sidebar-foreground/50 mt-1 truncate">{user.companyName}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-sidebar fixed inset-y-0 left-0 z-30">
        {SidebarContent}
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border h-16 flex items-center px-4 sm:px-6 gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
              {SidebarContent}
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center max-w-md flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
            <Input placeholder="Search employees, tickets, companies..." className="pl-9 bg-secondary border-0 h-9 focus-visible:ring-1" />
          </div>

          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-1.5 ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground grid place-items-center">{unread}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <p className="font-semibold text-sm">Notifications</p>
                  {unread > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                  )}
                </div>
                <ScrollArea className="max-h-96">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
                  ) : notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn("w-full text-left px-4 py-3 border-b border-border/60 last:border-0 hover:bg-secondary/50 transition-colors flex gap-3", !n.read && "bg-primary-soft/40")}
                    >
                      <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-9 pl-1.5 pr-2">
                  <div className="h-7 w-7 rounded-full gradient-primary grid place-items-center text-white text-xs font-bold">
                    {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user.role === "employee" ? "/me/profile" : "/admin/settings")}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(user.role === "employee" ? "/me/profile" : "/admin/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      <ChatbotWidget />
    </div>
  );
}
