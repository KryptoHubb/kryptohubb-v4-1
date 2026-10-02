import { useEffect, useState, type ReactNode } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  History,
  LayoutDashboard,
  LineChart,
  LogOut,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Wallet,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { marketItems } from "@/lib/marketData";
import { getCurrentUser, logout, type SessionUser } from "@/lib/auth";

const nav = [
  ["/app", "Dashboard", LayoutDashboard],
  ["/app/portfolio", "Portfolio", Wallet],
  ["/app/markets", "Markets", LineChart],
  ["/app/trade", "Trade", ShoppingCart],
  ["/app/wallet", "Wallet", Wallet],
  ["/app/deposit", "Deposit", ArrowDownToLine],
  ["/app/withdraw", "Withdraw", ArrowUpFromLine],
  ["/app/orders", "Orders", BarChart3],
  ["/app/history", "History", History],
  ["/app/kyc", "KYC", ShieldCheck],
  ["/app/settings", "Settings", Settings],
] as const;

function Shell({ children, user }: { children: ReactNode; user: SessionUser }) {
  const [location, setLocation] = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const signOut = async () => {
    setLoggingOut(true);
    await logout();
    setLocation("/login");
  };
  return (
    <div className="min-h-screen bg-[#10120f] text-[#eff1e6]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/[.08] bg-[#12150f] p-5 lg:block">
        <Link href="/" className="mb-8 block text-xl font-semibold">
          Krypto<span className="text-[#d5ff38]">Hubb</span>
        </Link>
        <div className="mb-5 rounded-xl border border-white/[.08] bg-[#151914] p-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="mt-1 truncate text-xs text-[#7f8979]">{user.email}</p>
        </div>
        <nav className="space-y-1">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${location === href ? "bg-[#d5ff38] text-[#10120f]" : "text-[#8e9688] hover:bg-white/[.05] hover:text-white"}`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          disabled={loggingOut}
          onClick={signOut}
          className="absolute bottom-6 flex items-center gap-3 px-3 text-sm text-[#8e9688] disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-[#7f8979]">
              {user.role === "USER"
                ? "Customer workspace"
                : `${user.role} workspace`}
            </span>
            <ThemeToggle compact />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[.08] bg-[#151914] p-5">
      <p className="text-xs text-[#7f8979]">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#7f8979]">{sub}</p>}
    </div>
  );
}
function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-[#7f8979]">
        Your KryptoHubb account at a glance.
      </p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Total balance" value="$0.00" />
        <Card title="Available" value="$0.00" />
        <Card title="Open orders" value="0" />
        <Card title="24h P&L" value="$0.00" />
      </div>
      <div className="mt-6 rounded-2xl border border-white/[.08] bg-[#151914] p-6">
        <h2 className="font-semibold">Markets</h2>
        <div className="mt-4 grid gap-2">
          {marketItems.slice(0, 5).map(m => (
            <div
              key={m.symbol}
              className="flex items-center justify-between border-b border-white/[.06] py-3"
            >
              <span>{m.symbol}</span>
              <span>{m.price}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
function Simple({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-[#7f8979]">{description}</p>
      <div className="mt-8 rounded-2xl border border-white/[.08] bg-[#151914] p-8">
        <div className="mx-auto max-w-lg text-center">
          <UserRound className="mx-auto size-10 text-[#d5ff38]" />
          <h2 className="mt-4 text-xl font-semibold">Sandbox module</h2>
          <p className="mt-2 text-sm leading-6 text-[#7f8979]">
            This screen is ready for the next backend stage. No real funds are
            moved here.
          </p>
        </div>
      </div>
    </>
  );
}
function Markets() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Markets</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[.08] bg-[#151914]">
        <div className="grid grid-cols-3 border-b border-white/[.08] p-4 text-xs text-[#7f8979]">
          <span>Asset</span>
          <span>Price</span>
          <span>24h</span>
        </div>
        {marketItems.map(m => (
          <div
            key={m.symbol}
            className="grid grid-cols-3 border-b border-white/[.06] p-4 text-sm"
          >
            <span>{m.symbol}</span>
            <span>{m.price}</span>
            <span>{m.change}</span>
          </div>
        ))}
      </div>
    </>
  );
}
function Trade() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Trade</h1>
      <div className="mt-6 max-w-xl rounded-2xl border border-white/[.08] bg-[#151914] p-6">
        <p className="text-sm text-[#7f8979]">Sandbox trading</p>
        <div className="mt-5 grid gap-4">
          <select className="rounded-xl border border-white/[.1] bg-[#10120f] p-3">
            <option>BTC/USDT</option>
            <option>ETH/USDT</option>
            <option>SOL/USDT</option>
          </select>
          <input
            className="rounded-xl border border-white/[.1] bg-[#10120f] p-3"
            placeholder="Amount"
          />
          <button
            className="rounded-xl bg-[#d5ff38] px-4 py-3 font-semibold text-[#10120f]"
            onClick={() => alert("Sandbox order: coming next")}
          >
            Place sandbox order
          </button>
        </div>
      </div>
    </>
  );
}
function AppRoutes() {
  return (
    <Switch>
      <Route path="/app" component={Dashboard} />
      <Route path="/app/markets" component={Markets} />
      <Route path="/app/trade" component={Trade} />
      <Route path="/app/portfolio">
        <Simple
          title="Portfolio"
          description="Track your asset holdings and performance."
        />
      </Route>
      <Route path="/app/wallet">
        <Simple
          title="Wallet"
          description="View sandbox balances and wallet activity."
        />
      </Route>
      <Route path="/app/deposit">
        <Simple title="Deposit" description="Create a sandbox deposit." />
      </Route>
      <Route path="/app/withdraw">
        <Simple title="Withdraw" description="Create a sandbox withdrawal." />
      </Route>
      <Route path="/app/orders">
        <Simple title="Orders" description="View open and completed orders." />
      </Route>
      <Route path="/app/history">
        <Simple
          title="Transaction history"
          description="Review account activity."
        />
      </Route>
      <Route path="/app/kyc">
        <Simple
          title="KYC"
          description="Manage identity verification status."
        />
      </Route>
      <Route path="/app/settings">
        <Simple
          title="Settings"
          description="Manage account preferences and security."
        />
      </Route>
      <Route>
        <Simple
          title="Not found"
          description="This workspace page does not exist."
        />
      </Route>
    </Switch>
  );
}

export default function Workspace() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCurrentUser()
      .then(u => {
        setUser(u);
        if (!u) setLocation("/login");
      })
      .finally(() => setLoading(false));
  }, [setLocation]);
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#10120f] text-[#7f8979]">
        Checking your session…
      </div>
    );
  if (!user) return null;
  return (
    <Shell user={user}>
      <AppRoutes />
    </Shell>
  );
}
