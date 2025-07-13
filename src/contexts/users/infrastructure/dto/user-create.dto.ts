import { z } from 'zod';

export const UserCreateDtoSchema = z.object({
  name:  z.string().min(2),
  email: z.email(),
  password:   z.string().min(8),
});
export type UserCreateDto = z.infer<typeof UserCreateDtoSchema>;