import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { getCurrentUser } from "@/lib/auth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [, nav] = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    getCurrentUser().then(current => {
      if (!current) {
        nav("/login");
        return;
      }

      if (!current.adminTier) {
        nav("/app");
        return;
      }

      setAllowed(true);
    });
  }, [nav]);

  if (!allowed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0d0f0c] text-[#697263]">
        Checking admin session…
      </div>
    );
  }

  return <>{children}</>;
}
