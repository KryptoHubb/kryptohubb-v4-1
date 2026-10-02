import {
  ArrowRight,
  ChevronDown,
  Code2,
  LineChart,
  ShieldCheck,
} from "lucide-react";
import { useLocation } from "wouter";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { SectionHeading } from "@/components/SectionHeading";
import { MarketTable } from "@/components/market/MarketTable";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { TickerStrip } from "@/components/sections/TickerStrip";
import { TrustStrip } from "@/components/sections/TrustStrip";

export default function Home() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#10120f]">
      <TopNav />
      <main>
        <HeroSection />
        <TickerStrip />
        <TrustStrip />

        <section
          id="markets"
          className="surface-grid border-b border-white/[0.08] py-24 sm:py-28"
        >
          <div className="container">
            <SectionHeading
              eyebrow="The market, in focus"
              title="Follow the signal."
              body="Everything you need to see what is moving, what is new, and where your attention belongs next."
              link="Open market view"
            />
            <MarketTable />
          </div>
        </section>

        <section className="border-b border-white/[0.08] py-20 sm:py-24">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-stretch">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#151914] p-7 sm:p-9">
                <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[#d5ff38]/[0.09] blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#d5ff38] text-[#10120f]">
                      <LineChart className="size-[19px]" />
                    </span>
                    <span className="eyebrow !text-[10px]">Why KryptoHubb</span>
                  </div>
                  <h3 className="display mt-16 max-w-md text-4xl leading-[.95] text-[#eff1e6] sm:text-5xl">
                    Trade with less noise, and more{" "}
                    <span className="italic text-[#d5ff38]">signal.</span>
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-6 text-[#818b78]">
                    A calmer interface for a market that never sleeps. Make
                    faster decisions without giving up the context that makes
                    them good.
                  </p>
                  <button
                    onClick={() =>
                      document
                        .getElementById("markets")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#d5ff38]"
                  >
                    See the KryptoHubb difference{" "}
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="grid gap-6 rounded-2xl border border-white/[0.1] bg-[#d5ff38] p-7 text-[#11130f] sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#11130f] text-[#d5ff38]">
                    <ShieldCheck className="size-[19px]" />
                  </span>
                  <span className="eyebrow !text-[#536018]">
                    In your corner
                  </span>
                </div>
                <p className="display mt-16 text-4xl leading-[.95] sm:text-5xl">
                  “Clear enough for day one. Powerful enough for day one
                  thousand.”
                </p>
                <div className="mt-auto flex items-center justify-between pt-8 text-xs text-[#536018]">
                  <span>Built for every kind of trader</span>
                  <Code2 className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid />
        <SecuritySection />

        <section className="border-b border-white/[0.08] py-24 sm:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">A better place to begin</p>
              <h2 className="display mt-5 text-5xl leading-[.92] text-[#f2f2e9] sm:text-7xl">
                Make your next move{" "}
                <span className="italic text-[#d5ff38]">count.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#858e7e]">
                Your first watchlist is a few clicks away. No noise, no pressure
                — just a clearer path into the market.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d5ff38] px-5 py-3.5 text-sm font-semibold text-[#10120f] transition hover:bg-[#e4ff85] active:scale-[.97]"
              >
                Create your account{" "}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#141713]">
          <div className="container flex flex-col gap-2 py-5 text-xs text-[#7f8979] sm:flex-row sm:items-center sm:justify-center sm:gap-3">
            <span>New here?</span>
            <button
              onClick={() =>
                document
                  .getElementById("markets")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-1 text-[#d5ff38]"
            >
              Start with the basics{" "}
              <ChevronDown className="size-3.5 -rotate-90" />
            </button>
            <span className="hidden text-[#4e584c] sm:inline">
              Learn at your own pace with market guides, explainers, and product
              tours.
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
