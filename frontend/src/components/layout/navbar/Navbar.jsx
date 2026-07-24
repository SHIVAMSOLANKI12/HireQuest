"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { PAGE_TITLES } from "@/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = ({ onMenuClick }) => {
  const pathname = usePathname();

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile */}
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
          <Avatar>
            <AvatarFallback>RP</AvatarFallback>
          </Avatar>

          <div className="hidden md:block">
            <p className="text-sm font-medium">
              Rohit
            </p>

            <p className="text-xs text-muted-foreground">
              HR Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
