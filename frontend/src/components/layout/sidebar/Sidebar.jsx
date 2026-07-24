"use client";

import { usePathname } from "next/navigation";

import { NAVIGATION } from "@/constants";

import {
  SidebarHeader,
  SidebarGroup,
} from ".";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      <SidebarHeader />

      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {NAVIGATION.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
          />
        ))}
      </nav>
    </aside>
  );
}
