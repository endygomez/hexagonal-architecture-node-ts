import { z } from 'zod';

export const UserUpdateDtoSchema = z.object({
  name:  z.string().min(2),
  email: z.email(),
});
export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;