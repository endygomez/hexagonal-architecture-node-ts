import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
}).transform(data => ({
  page: parseInt(data.page),
  limit: parseInt(data.limit)
}));
export type PaginationQueryDto = z.infer<typeof PaginationQuerySchema>;