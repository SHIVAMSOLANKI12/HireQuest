"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { PAGE_TITLES } from "@/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context";

const Navbar = ({ onMenuClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getInitials = (name) => {
    if (!name) return "HR";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Input
          type="search"
          placeholder="Search..."
          className="hidden w-64 md:block"
        />

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">
              {user?.name ?? "Rohit Solanki"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.company ?? "HireQuest HR"}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign Out"
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
