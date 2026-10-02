import { ArrowUpRight, Star } from "lucide-react";
import { useState } from "react";
import { useDemoAction } from "@/hooks/useDemoAction";
import { marketItems } from "@/lib/marketData";

const tabs = ["Favorites", "All crypto", "New listings", "Top gainers"];

function MiniChart({ path, tone }: { path: string; tone: "lime" | "soft" }) {
  const color = tone === "lime" ? "#d5ff38" : "#ff8585";
  return (
    <svg
      viewBox="0 0 160 42"
      preserveAspectRatio="none"
      className="h-9 w-[106px] sm:w-[140px]"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        opacity=".92"
      />
    </svg>
  );
}

export function MarketTable() {
  const [activeTab, setActiveTab] = useState("All crypto");
  const [favorites, setFavorites] = useState<string[]>([]);
  const demoAction = useDemoAction();
  const visibleItems =
    activeTab === "Favorites"
      ? marketItems.filter(item => favorites.includes(item.symbol))
      : activeTab === "Top gainers"
        ? marketItems
            .filter(item => item.change.includes("+"))
            .slice()
            .reverse()
        : marketItems;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#151914] shadow-[0_20px_70px_rgba(0,0,0,.14)]">
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.08] px-3 pt-3 sm:px-5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative shrink-0 px-3 py-3 text-xs font-medium transition ${activeTab === tab ? "text-[#d5ff38]" : "text-[#858e7e] hover:text-[#dce2d0]"}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-3 right-3 h-px bg-[#d5ff38]" />
            )}
          </button>
        ))}
      </div>
      <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_72px] gap-4 px-5 py-4 text-[10px] uppercase tracking-[.15em] text-[#677161] md:grid">
        <span>Asset</span>
        <span>Last price</span>
        <span>24h change</span>
        <span>24h volume</span>
        <span>Market cap</span>
        <span> </span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {visibleItems.length ? (
          visibleItems.map(item => {
            const isFavorite = favorites.includes(item.symbol);
            return (
              <div
                key={item.symbol}
                className="grid grid-cols-[1.5fr_1fr_auto] items-center gap-3 px-4 py-4 transition hover:bg-white/[0.025] md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_72px] md:gap-4 md:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    aria-label={`Favorite ${item.symbol}`}
                    onClick={() =>
                      setFavorites(current =>
                        isFavorite
                          ? current.filter(symbol => symbol !== item.symbol)
                          : [...current, item.symbol]
                      )
                    }
                    className={`shrink-0 transition ${isFavorite ? "text-[#d5ff38]" : "text-[#596255] hover:text-[#b7c09d]"}`}
                  >
                    <Star
                      className={`size-3.5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#22291d] text-[10px] font-semibold text-[#d5ff38]">
                    {item.symbol.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="mono truncate text-[13px] font-medium text-[#eef1e5]">
                      {item.symbol}
                      <span className="ml-2 text-[11px] font-normal text-[#6f7969]">
                        /USDT
                      </span>
                    </p>
                    <p className="truncate text-[11px] text-[#6f7969]">
                      {item.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mono text-[12px] text-[#dce2d0]">
                    {item.price}
                  </p>
                  <p className="mt-1 text-[10px] text-[#687261] md:hidden">
                    Last price
                  </p>
                </div>
                <div className="hidden md:block">
                  <span
                    className={`mono text-[12px] ${item.change.includes("-") ? "text-[#ff8585]" : "text-[#d5ff38]"}`}
                  >
                    {item.change}
                  </span>
                </div>
                <div className="hidden md:block mono text-[12px] text-[#adb5a2]">
                  {item.volume}
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <MiniChart path={item.chart} tone={item.tone} />
                  <span className="mono text-[11px] text-[#adb5a2]">
                    {item.cap}
                  </span>
                </div>
                <button
                  onClick={() => demoAction(`Trade ${item.symbol}`)}
                  className="hidden items-center justify-end gap-1 text-xs font-medium text-[#d5ff38] md:flex"
                >
                  Trade <ArrowUpRight className="size-3.5" />
                </button>
                <div className="col-span-full flex items-center justify-between md:hidden">
                  <span
                    className={`mono text-[11px] ${item.change.includes("-") ? "text-[#ff8585]" : "text-[#d5ff38]"}`}
                  >
                    {item.change}
                  </span>
                  <button
                    onClick={() => demoAction(`Trade ${item.symbol}`)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#d5ff38]"
                  >
                    Trade <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center text-sm text-[#7e8776]">
            No favorites yet. Tap the star beside an asset to keep it close.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-4">
        <p className="text-[11px] text-[#707a6b]">
          Prices update every 30 seconds
        </p>
        <button
          onClick={() => demoAction("View all markets")}
          className="text-[11px] font-medium text-[#d5ff38] hover:text-[#edffad]"
        >
          View all markets →
        </button>
      </div>
    </div>
  );
}
