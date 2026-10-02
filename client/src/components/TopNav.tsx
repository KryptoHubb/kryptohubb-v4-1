import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { navItems } from "@/lib/marketData";
import { BrandMark } from "./brand/BrandMark";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <header className="relative z-20 border-b border-white/[0.08] bg-[#10120f]/80 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-5">
        <a href="#top" className="shrink-0" aria-label="KryptoHubb home">
          <BrandMark />
        </a>
        <nav
          className="hidden min-w-0 items-center gap-0.5 lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                navigate(
                  item.label.toLowerCase().includes("market")
                    ? "#markets"
                    : "#top"
                );
              }}
              className="group flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium text-[#adb3a2] transition hover:bg-white/[0.05] hover:text-[#f3f2e8]"
            >
              {item.label}
              {item.menu && (
                <ChevronDown className="size-3.5 text-[#737b6a] transition group-hover:translate-y-0.5" />
              )}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button
            aria-label="Search"
            onClick={() =>
              document
                .getElementById("markets")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="grid size-9 place-items-center rounded-full text-[#aeb4a1] transition hover:bg-white/[0.06] hover:text-[#d5ff38]"
          >
            <Search className="size-[17px]" />
          </button>
          <ThemeToggle compact />
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#d4d8ca] transition hover:bg-white/[0.05] hover:text-white"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="rounded-lg bg-[#d5ff38] px-4 py-2.5 text-[13px] font-semibold text-[#10120f] transition hover:bg-[#e1ff76] active:scale-[.97]"
          >
            Create account
          </button>
        </div>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="grid size-9 place-items-center rounded-lg text-[#cbd1bf] hover:bg-white/[0.05] md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[0.08] bg-[#141713] px-5 pb-5 pt-3 md:hidden">
          <div className="grid gap-1">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  document
                    .getElementById("markets")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-[#c0c6b7] hover:bg-white/[0.05]"
              >
                {item.label}
                {item.menu && <ChevronDown className="size-4 text-[#737b6a]" />}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-2 border-t border-white/[0.08] pt-4">
            <ThemeToggle />
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border border-white/10 px-3 py-2.5 text-sm text-[#d4d8ca]"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-[#d5ff38] px-3 py-2.5 text-sm font-semibold text-[#10120f]"
            >
              Create account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
