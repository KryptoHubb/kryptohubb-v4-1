import {
  ArrowUpRight,
  BarChart3,
  Braces,
  Coins,
  Layers3,
  Zap,
} from "lucide-react";
import { useDemoAction } from "@/hooks/useDemoAction";

const products = [
  {
    icon: BarChart3,
    kicker: "TRADE",
    title: "One view. Every market.",
    body: "Spot, margin, and advanced order types — with the signal-to-noise ratio turned all the way up.",
    color: "#d5ff38",
  },
  {
    icon: Coins,
    kicker: "EARN",
    title: "Make idle assets useful.",
    body: "Flexible products and clear yield views designed to help your assets work a little harder.",
    color: "#b8d965",
  },
  {
    icon: Braces,
    kicker: "BUILD",
    title: "Your stack, connected.",
    body: "Build on a reliable API with deep liquidity, clean docs, and the tools your strategy needs.",
    color: "#e8e9c8",
  },
];

export function ProductGrid() {
  const demoAction = useDemoAction();
  return (
    <section
      id="products"
      className="border-b border-white/[0.08] py-24 sm:py-28"
    >
      <div className="container">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">One hub, many ways to move</p>
            <h2 className="display max-w-2xl text-4xl leading-[.96] text-[#f2f2e9] sm:text-5xl">
              Designed for your{" "}
              <span className="italic text-[#d5ff38]">next move.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#828b79]">
            Make the market feel less like a maze. Every product is considered,
            connected, and ready when you are.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {products.map(({ icon: Icon, kicker, title, body, color }, index) => (
            <button
              key={title}
              onClick={() => demoAction(title)}
              className={`hover-lift group relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#151914] p-6 text-left ${index === 1 ? "lg:translate-y-6" : ""}`}
            >
              <div
                className="absolute -right-12 -top-16 size-44 rounded-full opacity-[0.07] blur-3xl"
                style={{ background: color }}
              />
              <div className="relative flex h-full min-h-[250px] flex-col">
                <span
                  className="grid size-11 place-items-center rounded-xl border border-white/[0.1] bg-[#20251d]"
                  style={{ color }}
                >
                  <Icon className="size-5" />
                </span>
                <p className="eyebrow mt-10 !text-[10px]" style={{ color }}>
                  {kicker}
                </p>
                <h3 className="mt-3 max-w-[260px] text-2xl font-medium tracking-[-0.04em] text-[#e7ebdc]">
                  {title}
                </h3>
                <p className="mt-3 max-w-[300px] text-sm leading-6 text-[#818a77]">
                  {body}
                </p>
                <span className="mt-auto flex items-center gap-2 pt-7 text-xs font-medium text-[#d5ff38]">
                  Explore product{" "}
                  <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-3 text-xs text-[#75806f]">
          <Zap className="size-4 text-[#d5ff38]" />{" "}
          <span>Fast by default.</span>
          <span className="text-[#4f594d]">•</span>
          <span>Thoughtful by design.</span>
        </div>
      </div>
    </section>
  );
}
