// lib/validations/navigation.ts
import { z } from "zod";

export const navigationItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  href: z.string().min(1, "URL is required").startsWith("/", "URL must start with /"),
  description: z.string().optional(),
  type: z.enum(["MAIN", "DROPDOWN", "FOOTER", "SOCIAL", "UTILITY"]),
  parentId: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        // Allow null/empty for dropdown types
        if (val === null || val === "" || val === undefined) return true;
        // Validate the parent exists if provided
        return true; // You might want to add actual validation here
      },
      { message: "Invalid parent selected" }
    ),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  isExternal: z.boolean(),
  icon: z.string().optional(),
  roles: z.array(z.enum(["ADMIN", "USER", "HR", "MARKETING"])).min(1, "At least one role is required"),
});

export type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;
