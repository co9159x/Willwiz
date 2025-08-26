import { describe, it, expect } from 'vitest';
import { 
  clientSchema, 
  clientUpdateSchema, 
  willCreateSchema, 
  willUpdateSchema,
  noteSchema,
  taskSchema,
  pricingSchema 
} from '@/lib/validate';

describe('Validation Schemas', () => {
  describe('clientSchema', () => {
    it('should validate a valid client', () => {
      const validClient = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '07123456789',
        addressLine1: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
      };

      const result = clientSchema.safeParse(validClient);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidClient = {
        firstName: 'John',
        // missing lastName
        email: 'john@example.com',
      };

      const result = clientSchema.safeParse(invalidClient);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['lastName']);
      }
    });

    it('should reject invalid email', () => {
      const invalidClient = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      const result = clientSchema.safeParse(invalidClient);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });
  });

  describe('clientUpdateSchema', () => {
    it('should validate partial updates', () => {
      const validUpdate = {
        firstName: 'Jane',
        email: 'jane@example.com',
      };

      const result = clientUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow empty email string', () => {
      const validUpdate = {
        email: '',
      };

      const result = clientUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('willCreateSchema', () => {
    it('should validate a valid will creation', () => {
      const validWill = {
        clientId: 'client-123',
        jsonPayload: { test: 'data' },
        draftMarkdown: '# Test Will\n\nThis is a test will.',
      };

      const result = willCreateSchema.safeParse(validWill);
      expect(result.success).toBe(true);
    });

    it('should reject missing clientId', () => {
      const invalidWill = {
        jsonPayload: { test: 'data' },
      };

      const result = willCreateSchema.safeParse(invalidWill);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['clientId']);
      }
    });
  });

  describe('willUpdateSchema', () => {
    it('should validate will updates', () => {
      const validUpdate = {
        jsonPayload: { updated: 'data' },
        draftMarkdown: '# Updated Will\n\nThis is updated.',
      };

      const result = willUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const validUpdate = {
        draftMarkdown: '# Only markdown update',
      };

      const result = willUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('noteSchema', () => {
    it('should validate a valid note', () => {
      const validNote = {
        content: 'This is a test note about the client.',
        type: 'general',
      };

      const result = noteSchema.safeParse(validNote);
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidNote = {
        content: '',
        type: 'general',
      };

      const result = noteSchema.safeParse(invalidNote);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['content']);
      }
    });
  });

  describe('taskSchema', () => {
    it('should validate a valid task', () => {
      const validTask = {
        title: 'Follow up with client',
        description: 'Call client to discuss will changes',
        clientId: 'client-123',
        priority: 'high',
        dueDate: '2024-12-31',
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidTask = {
        title: 'Test task',
        // missing clientId
        priority: 'medium',
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['clientId']);
      }
    });

    it('should validate priority enum', () => {
      const validTask = {
        title: 'Test task',
        clientId: 'client-123',
        priority: 'low',
        dueDate: '2024-12-31',
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid priority', () => {
      const invalidTask = {
        title: 'Test task',
        clientId: 'client-123',
        priority: 'invalid',
        dueDate: '2024-12-31',
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['priority']);
      }
    });
  });

  describe('pricingSchema', () => {
    it('should validate valid pricing', () => {
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

    it('should reject negative prices', () => {
      const invalidPricing = {
        singleWillPrice: -1000,
        mirrorWillPrice: 35000,
        trustWillPrice: 75000,
        revenueSplitBroker: 90,
        revenueSplitPlatform: 10,
      };

      const result = pricingSchema.safeParse(invalidPricing);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['singleWillPrice']);
      }
    });

    it('should validate revenue split totals 100', () => {
      const validPricing = {
        singleWillPrice: 20000,
        mirrorWillPrice: 35000,
        trustWillPrice: 75000,
        revenueSplitBroker: 85,
        revenueSplitPlatform: 15,
      };

      const result = pricingSchema.safeParse(validPricing);
      expect(result.success).toBe(true);
    });

    it('should reject revenue split that does not total 100', () => {
      const invalidPricing = {
        singleWillPrice: 20000,
        mirrorWillPrice: 35000,
        trustWillPrice: 75000,
        revenueSplitBroker: 80,
        revenueSplitPlatform: 15, // Should be 20 to total 100
      };

      const result = pricingSchema.safeParse(invalidPricing);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('must total 100');
      }
    });
  });
});
