export interface PricingInfo {
  amount: string;
  period: string;
}

export const PRICING: Record<string, PricingInfo> = {
  monthly: { amount: 'R400', period: 'month' },
  yearly: { amount: 'R4000', period: 'year' },
};

export function getPricing(type: string): PricingInfo {
  return PRICING[type] ?? { amount: 'N/A', period: '' };
}
