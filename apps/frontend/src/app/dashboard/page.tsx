 export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded shadow">Employees: 120</div>
        <div className="bg-white p-5 rounded shadow">Leaves: 18</div>
        <div className="bg-white p-5 rounded shadow">Finance: ₹8.5L</div>
        <div className="bg-white p-5 rounded shadow">AI Calls: 340</div>
      </div>
    </div>
  );
}