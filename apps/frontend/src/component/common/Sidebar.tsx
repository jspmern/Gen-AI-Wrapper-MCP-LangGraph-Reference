"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENU } from "../../lib/route";
 

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-5">
      <h1 className="text-xl font-bold mb-8">AI MCP</h1>

      <nav className="space-y-2">
        {SIDEBAR_MENU.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 ${
                active ? "bg-white text-slate-950" : "hover:bg-slate-800"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}