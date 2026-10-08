import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCurrentUser, logout, type SessionUser } from "@/lib/auth";

export default function Admin() {
  const [, nav] = useLocation();
  const [data, setData] = useState<any>();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      const current = await getCurrentUser();
      if (!current) {
        nav("/login");
        return;
      }
      if (!current.adminTier) {
        nav("/app");
        return;
      }
      setUser(current);
      try {
        const r = await fetch("/api/admin/summary", { credentials: "include" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setData(d);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load admin data");
      }
    })();
  }, [nav]);
  const logoutNow = async () => {
    await logout();
    nav("/login");
  };
  if (!user)
    return (
      <div className="grid min-h-screen place-items-center bg-[#0d0f0c] text-[#697263]">
        Checking admin session…
      </div>
    );
  return (
    <div className="min-h-screen bg-[#0d0f0c] text-[#eff1e6]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#11140f] p-5 md:block">
        <Link href="/" className="font-semibold">
          Krypto<span className="text-[#d5ff38]">Hubb</span>{" "}
          <span className="text-xs text-[#697263]">ADMIN</span>
        </Link>
        <div className="mt-8 rounded-xl border border-white/10 bg-[#151914] p-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="mt-1 truncate text-xs text-[#697263]">{user.email}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-[#d5ff38]">
            {user.role}
          </p>
        </div>
        <nav className="mt-6 space-y-1">
  {[
    {
      label: "Dashboard",
      href: "/admin",
      permission: "admin.dashboard.view",
    },
    {
      label: "Users",
      href: "/admin/users",
      permission: "users.view",
    },
    {
      label: "KYC",
      href: "#",
      permission: "kyc.view",
    },
    {
      label: "Deposits",
      href: "#",
      permission: "transactions.view",
    },
    {
      label: "Withdrawals",
      href: "#",
      permission: "transactions.view",
    },
    {
      label: "Trades",
      href: "#",
      permission: "transactions.view",
    },
    {
      label: "Assets",
      href: "#",
      permission: "financial.config.view",
    },
    {
      label: "Support",
      href: "#",
      permission: "support.view",
    },
    {
      label: "Audit logs",
      href: "#",
      permission: "audit.view",
    },
    {
      label: "Settings",
      href: "#",
      permission: "system.manage",
    },
  ]
    .filter(item => {
      const permissions = {
        MASTER: true,
        OPERATIONS: [
          "admin.dashboard.view",
          "users.view",
          "kyc.view",
          "transactions.view",
          "support.view",
          "financial.config.view",
          "audit.view",
        ],
        SUPPORT: [
          "admin.dashboard.view",
          "users.view",
          "kyc.view",
          "transactions.view",
          "support.view",
        ],
      } as const;

      const allowed = permissions[user.adminTier!];
      return allowed === true || allowed.includes(item.permission as never);
    })
    .map(item => (
      <a
        key={item.label}
        href={item.href}
        className={`block rounded-lg px-3 py-2.5 text-sm ${
          item.label === "Dashboard"
            ? "bg-[#d5ff38] text-[#10120f] font-semibold"
            : "text-[#89917f] hover:bg-white/5 hover:text-white"
        }`}
      >
        {item.label}
      </a>
    ))}
</nav>
        <button
          onClick={logoutNow}
          className="absolute bottom-5 left-5 flex items-center gap-2 text-sm text-[#89917f]"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>
      <main className="md:ml-64">
        <header className="border-b border-white/10">
          <div className="container flex h-16 items-center justify-between">
            <div>
              <p className="eyebrow">Operations</p>
              <h1 className="font-semibold">Admin dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle compact />
              <Link href="/app" className="text-sm text-[#d5ff38]">
                Open customer app
              </Link>
            </div>
          </div>
        </header>
        <div className="container py-8">
          {error ? (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
              {error}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  icon={<Users />}
                  title="Total users"
                  value={data?.users ?? "—"}
                />
                <Metric
                  icon={<ArrowDownLeft />}
                  title="Deposits"
                  value={data?.deposits ?? "—"}
                />
                <Metric
                  icon={<ArrowUpRight />}
                  title="Withdrawals"
                  value={data?.withdrawals ?? "—"}
                />
                <Metric
                  icon={<Activity />}
                  title="Trades"
                  value={data?.trades ?? "—"}
                />
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-[#151914] p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#d5ff38]" />
                    <h2 className="font-semibold">Compliance queue</h2>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Queue name="KYC reviews" value={data?.pendingKyc ?? 0} />
                    <Queue
                      name="Pending withdrawals"
                      value={data?.pendingWithdrawals ?? 0}
                    />
                    <Queue
                      name="Open support tickets"
                      value={data?.openTickets ?? 0}
                    />
                  </div>
                </section>
                <section className="rounded-2xl border border-white/10 bg-[#151914] p-6">
                  <h2 className="font-semibold">System status</h2>
                  <div className="mt-6 space-y-3">
                    {["API", "Database", "Market data", "Background jobs"].map(
                      x => (
                        <div
                          key={x}
                          className="flex justify-between border-b border-white/10 py-3 text-sm"
                        >
                          <span>{x}</span>
                          <span className="text-[#d5ff38]">Configured</span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function Metric({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151914] p-5">
      <div className="grid size-9 place-items-center rounded-lg bg-[#d5ff38] text-[#10120f]">
        {icon}
      </div>
      <p className="mt-5 text-sm text-[#858e7e]">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
function Queue({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex justify-between rounded-xl bg-[#10120f] p-4 text-sm">
      <span>{name}</span>
      <span className="mono text-[#d5ff38]">{value}</span>
    </div>
  );
}
