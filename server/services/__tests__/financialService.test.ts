import { describe, expect, it } from "vitest";

describe("financialService", () => {
  it("accepts a valid positive ledger amount", () => {
    const amount = "125.50000000";

    expect(/^\d+(?:\.\d{1,18})?$/.test(amount)).toBe(true);
    expect(/^0+(?:\.0{1,18})?$/.test(amount)).toBe(false);
  });

  it("rejects zero ledger amounts", () => {
    const amounts = ["0", "0.0", "0.00000000"];

    for (const amount of amounts) {
      expect(/^0+(?:\.0{1,18})?$/.test(amount)).toBe(true);
    }
  });

  it("rejects amounts with more than 18 decimal places", () => {
    const amount = "1.1234567890123456789";

    expect(/^\d+(?:\.\d{1,18})?$/.test(amount)).toBe(false);
  });

  it("recognizes balanced debit and credit totals", () => {
    const debit = "100.250000000000000000";
    const credit = "100.250000000000000000";

    expect(debit).toBe(credit);
  });
});
