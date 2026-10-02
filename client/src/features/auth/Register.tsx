import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Register() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      navigate("/app");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#10120f] px-5 py-10 text-[#eff1e6]">
      <div className="mx-auto max-w-md pt-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="eyebrow text-[#d5ff38]">
            KryptoHubb
          </Link>
          <ThemeToggle compact />
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#151914] p-7 sm:p-9">
          <h1 className="text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-[#858e7e]">
            Start with a sandbox account while the production services are
            configured.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-sm">
              Full name
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#10120f] px-4 py-3"
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#10120f] px-4 py-3"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                required
                minLength={8}
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#10120f] px-4 py-3"
              />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button className="w-full rounded-xl bg-[#d5ff38] px-5 py-3.5 font-semibold text-[#10120f]">
              Create account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#858e7e]">
            Already registered?{" "}
            <Link href="/login" className="text-[#d5ff38]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
