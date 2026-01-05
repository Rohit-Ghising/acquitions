import { z } from "zod"

export const userIdSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10)
    if (isNaN(num) || num <= 0) {
      throw new Error("Invalid user ID")
    }
    return num
  })
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  email: z.string().email().min(2).max(255).toLowerCase().trim().optional(),
  role: z.enum(["user", "admin"]).optional()
}).refine((data) => {
  // Ensure at least one field is provided for update
  return Object.keys(data).length > 0
}, {
  message: "At least one field must be provided for update"
})