import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('UK'),
});

export const clientUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  dob: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
});

export const willPayloadSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    address: z.string(),
    dob: z.string(),
  }),
  executors: z.array(z.object({
    name: z.string(),
    address: z.string(),
    relationship: z.string(),
  })),
  beneficiaries: z.array(z.object({
    name: z.string(),
    share: z.number(),
    relationship: z.string(),
  })),
  guardianship: z.object({
    hasMinorChildren: z.boolean(),
    guardians: z.array(z.object({
      name: z.string(),
      address: z.string(),
    })).optional(),
  }),
  residue: z.object({
    distribution: z.string(),
    specificBequests: z.array(z.object({
      item: z.string(),
      beneficiary: z.string(),
    })),
  }),
});

export const willCreateSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  jsonPayload: z.record(z.any()).optional(),
  draftMarkdown: z.string().optional(),
});

export const willUpdateSchema = z.object({
  jsonPayload: z.record(z.any()).optional(),
  draftMarkdown: z.string().optional(),
});

export const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  type: z.enum(['general', 'important', 'urgent']).default('general'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).default('pending'),
});

export const pricingSchema = z.object({
  singleWillPrice: z.number().min(0),
  mirrorWillPrice: z.number().min(0),
  trustWillPrice: z.number().min(0),
  revenueSplitBroker: z.number().min(0).max(100),
  revenueSplitPlatform: z.number().min(0).max(100),
}).refine((data) => data.revenueSplitBroker + data.revenueSplitPlatform === 100, {
  message: "Revenue split must total 100",
  path: ["revenueSplitPlatform"],
});