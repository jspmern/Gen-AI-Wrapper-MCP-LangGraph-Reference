 

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">AI MCP</h1>

      <nav className="space-y-3">
        <Link href="/dashboard" className="block">Dashboard</Link>
        <Link href="/chat" className="block">AI Chat</Link>
        <Link href="/employees" className="block">Employees</Link>
        <Link href="/leaves" className="block">Leaves</Link>
        <Link href="/finance" className="block">Finance</Link>
      </nav>
    </aside>
  );
}