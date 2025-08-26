import { describe, it, expect } from 'vitest';
import { clientSchema, willPayloadSchema, pricingSchema } from '@/lib/validate';

describe('Validation schemas', () => {
  it('validates client data correctly', () => {
    const validClient = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+44 20 1234 5678',
      country: 'UK',
    };

    const result = clientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });

  it('rejects invalid client email', () => {
    const invalidClient = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    const result = clientSchema.safeParse(invalidClient);
    expect(result.success).toBe(false);
  });

  it('validates pricing data correctly', () => {
    const validPricing = {
      singleWillPrice: 20000,
      mirrorWillPrice: 35000,
      trustWillPrice: 75000,
      revenueSplitBroker: 90,
      revenueSplitPlatform: 10,
    };

    const result = pricingSchema.safeParse(validPricing);
    expect(result.success).toBe(true);
  });

  it('calculates revenue split correctly', () => {
    const brokerSplit = 90;
    const platformSplit = 10;
    const totalRevenue = 1000;

    const brokerRevenue = (totalRevenue * brokerSplit) / 100;
    const platformRevenue = (totalRevenue * platformSplit) / 100;

    expect(brokerRevenue).toBe(900);
    expect(platformRevenue).toBe(100);
  });
});