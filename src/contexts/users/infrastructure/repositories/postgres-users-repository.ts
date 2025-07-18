import { Pool } from "pg";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { PaginatedResult, PaginationMeta } from "../../../shared/domain/PaginationParams";
import { QueryParams } from "../../../shared/utils/query-builder/query-builder.interface";
import { QueryBuilder } from "../../../shared/utils/query-builder/query-builder";

export class PostgresUsersRepository implements UserRepository {
    
    constructor(private readonly pool: Pool) {}

    async create(user: User): Promise<void> {
        const query = {
            text: `
                INSERT INTO users (id, name, email, password, created_at, updated_at, deleted_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
            values: [
                user.id.value,
                user.name.value,
                user.email.value,
                user.passwordHash.value,
                user.createdAt.value,
                user.updatedAt?.value ?? null,
                user.deletedAt?.value ?? null,
            ],
        };
        await this.pool.query(query);
    }

    async findOneById(id: string): Promise<User | null> {
        const query = {
            text: `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`,
            values: [id],
        };
        const result = await this.pool.query(query);
        if (result.rows.length === 0) return null;
        
        return User.fromPrimitives({
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            password: result.rows[0].password,
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at,
            deleted_at: result.rows[0].deleted_at
        });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const query = {
            text: `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
            values: [email],
        };
        const result = await this.pool.query(query);
        if (result.rows.length === 0) return null;
        
        return User.fromPrimitives({
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            password: result.rows[0].password,
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at,
            deleted_at: result.rows[0].deleted_at
        });
    }

    async update(user: User): Promise<void> {
        const query = {
            text: `
                UPDATE users
                SET name = $1, email = $2, password = $3, updated_at = $4, deleted_at = $5
                WHERE id = $6
            `,
            values: [
                user.name.value,
                user.email.value,
                user.passwordHash.value,
                user.updatedAt?.value ?? null,
                user.deletedAt?.value ?? null,
                user.id.value,
            ],
        };
        await this.pool.query(query);
    }

    async delete(id: string): Promise<void> {
        const query = {
            text: `DELETE FROM users WHERE id = $1`,
            values: [id],
        };
        await this.pool.query(query);
    }

    async findAll(params: QueryParams): Promise<PaginatedResult<User>> {
        const { limit = 10, page = 1, sort, filters, search } = params;
        const offset = (page - 1) * limit;

        // Build main query - only include non-deleted users
        const qb = new QueryBuilder('SELECT * FROM users WHERE deleted_at IS NULL');

        // Apply filters
        if (filters) {
            Object.entries(filters).forEach(([field, value]) => {
                if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([op, val]) => {
                        qb.addFilter(field, { [op]: val });
                    });
                } else {
                    qb.addFilter(field, { eq: value });
                }
            });
        }

        // Apply search (example: name or email)
        if (search && search.trim() !== '') {
            // For now, only search by name and email (OR logic)
            // This is a simple approach, for more complex cases, extend QueryBuilder
            qb.addFilter('name', { like: search });
            // Optionally, add OR for email
            // qb.addOr([{ field: 'name', operator: { like: search } }, { field: 'email', operator: { like: search } }]);
        }

        // Apply sort
        if (sort && sort.length > 0) {
            qb.addSort(sort);
        } else {
            qb.addSort([{ field: 'created_at', direction: 'desc' }]);
        }

        // Apply pagination
        qb.addPagination(page, limit);

        const { text, values } = qb.build();

        // Build count query (without pagination and sort) - only include non-deleted users
        const countQb = new QueryBuilder('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
        if (filters) {
            Object.entries(filters).forEach(([field, value]) => {
                if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([op, val]) => {
                        countQb.addFilter(field, { [op]: val });
                    });
                } else {
                    countQb.addFilter(field, { eq: value });
                }
            });
        }
        if (search && search.trim() !== '') {
            countQb.addFilter('name', { like: search });
        }
        const { text: countText, values: countValues } = countQb.build();

        // Query DB
        const [dataResult, countResult] = await Promise.all([
            this.pool.query(text, values),
            this.pool.query(countText, countValues),
        ]);

        const totalItems = parseInt(countResult.rows[0].count, 10);
        const items = dataResult.rows.map(row => {
            return User.fromPrimitives({
                id: row.id,
                name: row.name,
                email: row.email,
                password: row.password,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at
            });
        });

        const meta: PaginationMeta = {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            hasNextPage: offset + limit < totalItems,
            hasPreviousPage: offset > 0,
        };

        return { items, meta };
    }

    // Method to find user by ID including deleted users (for delete operations)
    async findByIdIncludingDeleted(id: string): Promise<User | null> {
        const query = {
            text: `SELECT * FROM users WHERE id = $1`,
            values: [id],
        };
        const result = await this.pool.query(query);
        if (result.rows.length === 0) return null;
        
        return User.fromPrimitives({
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            password: result.rows[0].password,
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at,
            deleted_at: result.rows[0].deleted_at
        });
    }
}
