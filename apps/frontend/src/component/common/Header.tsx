// src/component/common/Header.tsx

export default function Header() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="font-semibold">Enterprise AI Dashboard</h2>

      <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
}