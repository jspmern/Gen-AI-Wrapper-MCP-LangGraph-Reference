 "use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/chat": "AI Chat",
  "/employees": "Employees",
  "/leaves": "Leaves",
  "/finance": "Finance",
};

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="font-semibold text-lg">
        {PAGE_TITLES[pathname] || "AI MCP"}
      </h2>

      <button className="bg-slate-900 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
}