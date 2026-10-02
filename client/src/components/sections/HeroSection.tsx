import { ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/[0.08]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(213,255,56,.13),transparent_24%),radial-gradient(circle_at_18%_8%,rgba(115,145,50,.12),transparent_22%)]" />
      <div className="container relative grid gap-16 py-16 sm:py-20 lg:grid-cols-[.93fr_1.07fr] lg:items-center lg:gap-12 lg:py-[92px]">
        <div className="max-w-[600px]">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-[#d5ff38]/20 bg-[#d5ff38]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#d5ff38]">
            <span className="pulse-dot size-1.5 rounded-full bg-[#d5ff38]" />{" "}
            The clearer crypto hub
          </div>
          <h1 className="display reveal reveal-delay-1 mt-7 text-[clamp(3.7rem,8vw,7rem)] leading-[.87] text-[#f4f3e9]">
            Your crypto,
            <br />
            <span className="italic text-[#d5ff38]">clearly.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-7 max-w-[510px] text-base leading-7 text-[#929a87] sm:text-[17px]">
            KryptoHubb brings the whole market into focus. Trade, earn, and move
            with confidence from one beautifully considered place.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate("/register")}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5ff38] px-5 py-3.5 text-sm font-semibold text-[#11130f] shadow-[0_12px_34px_rgba(213,255,56,.12)] transition hover:bg-[#e5ff84] active:scale-[.97]"
            >
              Start trading{" "}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("markets")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.13] px-5 py-3.5 text-sm font-medium text-[#d8ddcf] transition hover:border-[#d5ff38]/40 hover:bg-white/[0.04] active:scale-[.97]"
            >
              <Play className="size-3.5 fill-current" /> Explore markets
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-[#707966]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#d5ff38]" /> Built for trust
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-[#d5ff38]" /> Pro-grade tools
            </span>
          </div>
        </div>

        <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[620px] lg:mx-0">
          <div className="absolute -inset-4 rounded-[32px] bg-[#d5ff38]/[0.08] blur-3xl" />
          <div className="glass relative overflow-hidden rounded-[24px] p-2 shadow-[0_30px_90px_rgba(0,0,0,.34)]">
            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#171b15] p-5 sm:p-7">
              <img
                src="/manus-storage/kryptohubb-hero_49db93d7.jpg"
                alt="Abstract KryptoHubb crypto network"
                className="absolute inset-0 size-full object-cover opacity-30 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,#171b15_5%,rgba(23,27,21,.82)_38%,rgba(23,27,21,.42)_74%,rgba(23,27,21,.76))]" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="eyebrow">KryptoHubb Flow</p>
                  <p className="mt-2 text-[13px] text-[#9ca58d]">BTC / USDT</p>
                </div>
                <div className="rounded-full border border-[#d5ff38]/25 bg-[#d5ff38]/[0.08] px-2.5 py-1 font-mono text-[10px] text-[#d5ff38]">
                  LIVE · 24H
                </div>
              </div>
              <div className="relative mt-8 flex items-end justify-between gap-3">
                <div>
                  <p className="mono text-[clamp(2rem,5vw,3.6rem)] font-medium tracking-[-0.08em] text-[#f4f3e9]">
                    $84,420<span className="text-2xl text-[#b6bdab]">.00</span>
                  </p>
                  <p className="mono mt-2 text-[12px] text-[#d5ff38]">
                    +0.01% <span className="ml-2 text-[#727c6b]">today</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow">Market depth</p>
                  <p className="mono mt-2 text-sm text-[#e8eddb]">$42.8B</p>
                </div>
              </div>
              <div className="relative mt-8 h-[190px] w-full overflow-hidden rounded-xl border border-white/[0.07] bg-[#121610]/65 p-3 sm:h-[230px]">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(213,255,56,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(213,255,56,.07) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                />
                <svg
                  viewBox="0 0 600 220"
                  preserveAspectRatio="none"
                  className="relative size-full"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#d5ff38" stopOpacity=".26" />
                      <stop offset="1" stopColor="#d5ff38" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 183 C 25 190, 35 138, 68 159 S 108 170, 136 116 S 185 147, 211 109 S 252 132, 282 69 S 327 105, 356 88 S 396 112, 427 50 S 467 70, 494 43 S 550 66, 600 11 L600 220 L0 220Z"
                    fill="url(#chartFill)"
                  />
                  <path
                    d="M0 183 C 25 190, 35 138, 68 159 S 108 170, 136 116 S 185 147, 211 109 S 252 132, 282 69 S 327 105, 356 88 S 396 112, 427 50 S 467 70, 494 43 S 550 66, 600 11"
                    fill="none"
                    stroke="#d5ff38"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx="600" cy="11" r="5" fill="#d5ff38" />
                  <circle
                    cx="600"
                    cy="11"
                    r="12"
                    fill="#d5ff38"
                    opacity=".15"
                  />
                </svg>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between mono text-[9px] text-[#5f6859]">
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>NOW</span>
                </div>
              </div>
              <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-5">
                {[
                  ["24h high", "$85,302"],
                  ["24h low", "$82,911"],
                  ["Turnover", "$42.8B"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="eyebrow !text-[9px]">{label}</p>
                    <p className="mono mt-1.5 text-[12px] text-[#c9cfbe]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="float-slow absolute -bottom-6 -left-5 hidden rounded-2xl border border-white/[0.12] bg-[#1b2118]/95 p-3 shadow-2xl backdrop-blur sm:block">
            <p className="eyebrow !text-[9px]">Assets under watch</p>
            <p className="mono mt-1 text-base text-[#d5ff38]">600+</p>
          </div>
        </div>
      </div>
    </section>
  );
}
