import {
  ArrowUpRight,
  Fingerprint,
  KeyRound,
  ScanFace,
  ShieldCheck,
} from "lucide-react";
import { useDemoAction } from "@/hooks/useDemoAction";

const securityItems = [
  {
    icon: KeyRound,
    title: "Account protection",
    copy: "Passkeys, two-factor authentication, and smart withdrawal controls.",
  },
  {
    icon: ScanFace,
    title: "Identity, not friction",
    copy: "A guided verification flow that keeps you moving without the mystery.",
  },
  {
    icon: ShieldCheck,
    title: "Reserves you can see",
    copy: "Clear proof-of-reserves signals and risk monitoring at every layer.",
  },
];

export function SecuritySection() {
  const demoAction = useDemoAction();
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-[#d5ff38] py-24 text-[#11130f] sm:py-28"
    >
      <div className="absolute -right-28 -top-32 size-[420px] rounded-full border border-[#10120f]/10 opacity-60" />
      <div className="absolute -right-16 -top-20 size-[270px] rounded-full border border-[#10120f]/10 opacity-60" />
      <div className="container relative grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <p className="eyebrow !text-[#526019]">
            Security, without the theater
          </p>
          <h2 className="display mt-5 max-w-xl text-5xl leading-[.92] sm:text-6xl">
            The calm behind every click.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#536018]">
            When your assets matter, clarity is a feature. KryptoHubb puts
            security, transparency, and control in the same place as the action.
          </p>
          <button
            onClick={() => demoAction("Read our security approach")}
            className="group mt-8 inline-flex items-center gap-2 border-b border-[#11130f]/30 pb-2 text-sm font-semibold text-[#11130f]"
          >
            Read our security approach{" "}
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        <div className="grid gap-3">
          {securityItems.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="flex items-start gap-5 rounded-2xl border border-[#11130f]/10 bg-[#e3ff77]/50 p-5 transition hover:bg-[#eaff99]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#11130f] text-[#d5ff38]">
                <Icon className="size-[18px]" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1.5 max-w-lg text-sm leading-6 text-[#59651b]">
                  {copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
