import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setUsers(d);
      })
      .catch(e => setError(e.message));
  }, []);
  const filtered = users.filter(u =>
    `${u.name} ${u.email} ${u.role} ${u.status}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-[#0d0f0c] text-[#eff1e6]">
      <header className="border-b border-white/10">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-[#d5ff38]"
          >
            <ArrowLeft className="size-4" /> Admin dashboard
          </Link>
          <span className="text-sm text-[#697263]">User management</span>
        </div>
      </header>
      <main className="container py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="mt-2 text-4xl font-semibold">Users</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#151914] px-3 py-2">
            <Search className="size-4 text-[#697263]" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search users"
              className="w-48 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        {error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
            {error}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151914]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-[#697263]">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-[#697263]">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">{u.role}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#d5ff38]/10 px-2.5 py-1 text-xs text-[#d5ff38]">
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#858e7e]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-[#697263]"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
