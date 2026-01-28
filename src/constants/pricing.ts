export interface PricingInfo {
  amount: string;
  period: string;
}

export const PRICING: Record<string, PricingInfo> = {
  monthly: { amount: 'R50', period: 'month' },
  yearly: { amount: 'R500', period: 'year' },
};

export function getPricing(type: string): PricingInfo {
  return PRICING[type] ?? { amount: 'N/A', period: '' };
}
