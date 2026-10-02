import { tickerItems } from "@/lib/marketData";

export function TickerStrip() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker-fade overflow-hidden border-b border-white/[0.08] bg-[#121510]">
      <div className="container mobile-scroll flex gap-8 py-3.5 whitespace-nowrap">
        {items.map((item, index) => {
          const positive = !item.includes("-");
          return (
            <span
              key={`${item}-${index}`}
              className="mono text-[10px] tracking-[.02em] text-[#737c6d]"
            >
              <span className="mr-2 text-[#d8ddcf]">{item.split("  ")[0]}</span>
              {item.split("  ").slice(1).join("  ")}{" "}
              <span
                className={
                  positive ? "ml-2 text-[#d5ff38]" : "ml-2 text-[#ff8585]"
                }
              >
                {positive ? "↗" : "↘"}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
