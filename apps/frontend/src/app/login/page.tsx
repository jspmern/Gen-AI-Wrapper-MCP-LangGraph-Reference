 

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input className="border p-3 w-full mb-4" placeholder="Email" />
        <input className="border p-3 w-full mb-4" placeholder="Password" />

        <button className="bg-slate-900 text-white w-full p-3 rounded">
          Login
        </button>
      </div>
    </div>
  );
}