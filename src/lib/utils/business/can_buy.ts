import type { BusinessData } from "$lib/types/business";

const requirements = [0n, 1n, 5n, 10n, 20n];

export default function canBuy(businessNumber: number, businesses: BusinessData[]): { can_buy_this: boolean; requirement: number } {
  const requiredMarketShare = requirements[businessNumber] || 0n;

  console.log(`Checking if can buy business ${businessNumber} with required market share: ${requiredMarketShare}`);
  console.log('Check', businesses.some(b => b.revenue[0]?.value >= (b.sectorRevenue || 0n) * requiredMarketShare / 100n),)

  return {
    can_buy_this: businesses.some(b => b.revenue[0]?.value >= (b.sectorRevenue || 0n) * requiredMarketShare / 100n),
    requirement: Number(requiredMarketShare),
  }
}
