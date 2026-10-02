import { Globe2, LockKeyhole, UsersRound } from "lucide-react";

const stats = [
  {
    icon: UsersRound,
    value: "18.4M+",
    label: "people building their portfolio",
  },
  { icon: Globe2, value: "180+", label: "markets connected worldwide" },
  { icon: LockKeyhole, value: "24 / 7", label: "risk monitoring, always on" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-white/[0.08] bg-[#141713]">
      <div className="container grid divide-y divide-white/[0.08] py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 px-0 py-5 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#d5ff38]/15 bg-[#d5ff38]/[0.06] text-[#d5ff38]">
              <Icon className="size-[18px]" />
            </span>
            <div>
              <p className="mono text-lg tracking-[-0.04em] text-[#eef1e5]">
                {value}
              </p>
              <p className="mt-0.5 text-xs text-[#808a76]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
