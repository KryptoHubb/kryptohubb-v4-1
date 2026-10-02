export type MarketItem = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  volume: string;
  cap: string;
  tone: "lime" | "soft";
  chart: string;
};

export const marketItems: MarketItem[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$84,420.00",
    change: "+0.01%",
    volume: "$42.8B",
    cap: "$1.67T",
    tone: "lime",
    chart:
      "M2 36 C 22 24, 28 31, 41 29 S 55 34, 68 21 S 83 30, 96 18 S 111 23, 126 13 S 142 17, 157 7",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$2,690.47",
    change: "+0.23%",
    volume: "$18.1B",
    cap: "$324.2B",
    tone: "lime",
    chart:
      "M2 32 C 18 37, 26 27, 39 28 S 58 22, 68 30 S 85 19, 96 20 S 117 12, 128 18 S 144 9, 157 11",
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: "$776.84",
    change: "+1.24%",
    volume: "$2.4B",
    cap: "$109.5B",
    tone: "lime",
    chart:
      "M2 31 C 20 25, 25 33, 39 27 S 56 23, 69 26 S 81 16, 96 17 S 118 20, 126 9 S 145 18, 157 5",
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: "$1.54",
    change: "+2.33%",
    volume: "$5.9B",
    cap: "$89.7B",
    tone: "lime",
    chart:
      "M2 34 C 17 31, 24 33, 36 35 S 51 25, 64 29 S 77 30, 89 17 S 105 21, 119 11 S 139 12, 157 5",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$193.40",
    change: "-0.42%",
    volume: "$4.6B",
    cap: "$93.9B",
    tone: "soft",
    chart:
      "M2 12 C 17 18, 28 11, 42 22 S 57 20, 69 25 S 83 21, 98 30 S 115 24, 128 33 S 145 31, 157 38",
  },
];

export const tickerItems = [
  "BTC / USDT  $84,420.00  +0.01%",
  "ETH / USDT  $2,690.47  +0.23%",
  "BNB / USDT  $776.84  +1.24%",
  "SOL / USDT  $193.40  -0.42%",
  "XRP / USDT  $1.54  +2.33%",
];

export const navItems = [
  { label: "Buy Crypto", menu: true },
  { label: "Markets", menu: false },
  { label: "Trade", menu: true },
  { label: "Derivatives", menu: true },
  { label: "Earn", menu: true },
  { label: "Square", menu: false },
  { label: "More", menu: true },
];
