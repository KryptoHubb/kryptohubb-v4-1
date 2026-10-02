import axios from "axios";
import { z } from "zod";
import { saveExchangeRate } from "./currencyService.js";

const COINGECKO_PROVIDER = "coingecko";

const COIN_ID_TO_CURRENCY: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
};

const marketDataResponseSchema = z.record(
  z.string(),
  z.object({
    usd: z.number().positive(),
  })
);

export type MarketPrice = {
  coinId: string;
  currency: string;
  price: string;
  observedAt: Date;
  provider: string;
};

function getConfig() {
  const baseUrl = process.env.MARKET_DATA_API_URL;
  const apiKey = process.env.MARKET_DATA_API_KEY;

  if (!baseUrl) {
    throw new Error("MARKET_DATA_API_URL is not configured.");
  }

  if (!apiKey) {
    throw new Error("MARKET_DATA_API_KEY is not configured.");
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
  };
}

export async function fetchCryptoPrices(
  coinIds: string[]
): Promise<MarketPrice[]> {
  if (coinIds.length === 0) {
    return [];
  }

  const { baseUrl, apiKey } = getConfig();

  const response = await axios.get(`${baseUrl}/simple/price`, {
    headers: {
      "x-cg-demo-api-key": apiKey,
    },
    params: {
      ids: coinIds.join(","),
      vs_currencies: "usd",
    },
    timeout: 10_000,
  });

  const parsed = marketDataResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error("CoinGecko returned an invalid market-data response.");
  }

  const observedAt = new Date();

  return Object.entries(parsed.data).map(([coinId, data]) => {
    const currency = COIN_ID_TO_CURRENCY[coinId];

    if (!currency) {
      throw new Error(`Unsupported CoinGecko coin ID: ${coinId}`);
    }

    return {
      coinId,
      currency,
      price: data.usd.toString(),
      observedAt,
      provider: COINGECKO_PROVIDER,
    };
  });
}

export async function syncCryptoPricesToExchangeRates(
  coinIds: string[]
): Promise<void> {
  const prices = await fetchCryptoPrices(coinIds);

  for (const price of prices) {
    const observedAt = price.observedAt;
    const expiresAt = new Date(observedAt.getTime() + 60_000);

    await saveExchangeRate({
      baseCurrency: price.currency,
      quoteCurrency: "USD",
      rate: price.price,
      provider: price.provider,
      providerReference: price.coinId,
      observedAt,
      expiresAt,
    });
  }
}
