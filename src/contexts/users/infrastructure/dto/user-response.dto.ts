import { z } from 'zod';
export const UserResponseDtoSchema = z.object({
  id:    z.uuidv4(),
  name:  z.string(),
  email: z.email(),
});
export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;