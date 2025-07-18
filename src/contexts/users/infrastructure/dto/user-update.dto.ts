import { z } from 'zod';

export const UserUpdateDtoSchema = z.object({
  name:  z.string().min(2).optional(),
  email: z.email().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided"
});
export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;