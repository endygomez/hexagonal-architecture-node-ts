import { z } from 'zod';

import { SortOrder } from '../../utils/query-builder/query-builder.interface';

export const QueryParamsSchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    sort: z.string().optional().transform(str => {
        if (!str) return undefined;
        return str.split(',').map(s => {
            const [field, direction] = s.split(':');
            return { field, direction: direction || 'asc' };
        });
    }),
    search: z.string().optional(),
    filters: z.string().optional().transform(str => {
        if (!str) return undefined;
        try {
            return JSON.parse(str);
        } catch {
            throw new Error('Invalid filters format');
        }
    })
}).transform(data => ({
    page: parseInt(data.page),
    limit: parseInt(data.limit),
    sort: data.sort as SortOrder[],
    search: data.search,
    filters: data.filters
}));

export type QueryParamsDto = z.infer<typeof QueryParamsSchema>;