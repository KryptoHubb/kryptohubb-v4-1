import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Login failed");
      navigate(
        data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN"
          ? "/admin"
          : "/app"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-[#d5ff38] text-[#10120f]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Welcome back</h1>
              <p className="text-sm text-[#858e7e]">
                Sign in to your KryptoHubb account.
              </p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm">
              Email
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                type="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#10120f] px-4 py-3 outline-none focus:border-[#d5ff38]"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                type="password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#10120f] px-4 py-3 outline-none focus:border-[#d5ff38]"
              />
            </label>
            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d5ff38] px-5 py-3.5 font-semibold text-[#10120f]">
              Sign in <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#858e7e]">
            No account yet?{" "}
            <Link href="/register" className="text-[#d5ff38]">
              Create one
            </Link>
          </p>
        </div>
        <p className="mt-5 text-center text-xs text-[#626b5c]">
          Development build: financial actions are sandbox-only until providers
          are connected.
        </p>
      </div>
    </div>
  );
}
