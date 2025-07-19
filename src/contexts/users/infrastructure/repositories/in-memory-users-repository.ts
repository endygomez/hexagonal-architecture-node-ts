import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { PaginatedResult } from "../../../shared/domain/interfaces/pagination.interface";
import { PaginationMeta, PaginationParams } from "src/contexts/shared/domain/interfaces/pagination.interface";
import { QueryParams } from "src/contexts/shared/utils/query-builder/query-builder.interface";
import { InMemoryFilterService } from "src/contexts/shared/infrastructure/persistence/in-memory-filter.service";

export class InMemoryUsersRepository implements UserRepository {
    private users: User[] = [];

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    async findOneById(id: string): Promise<User | null> {
        return this.users.find(user => user.id.value === id && !user.isDeleted) || null;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email.value === email && !user.isDeleted) || null;
    }

    async update(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.id.value === user.id.value);
        if (index !== -1) {
            this.users[index] = user;
        }
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(user => user.id.value !== id);
    }

    async findAll(params: QueryParams): Promise<PaginatedResult<User>> {
        // Filter out deleted users first
        const nonDeletedUsers = this.users.filter(user => !user.isDeleted);
        let filtered = InMemoryFilterService.applyFilters(nonDeletedUsers, params);

        // Aplicar paginación
        const { page = 1, limit = 10 } = params;
        const { items, totalItems } = InMemoryFilterService.applyPagination(filtered, page, limit);

        // Construir metadatos de paginación
        const meta: PaginationMeta = {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            hasNextPage: page * limit < totalItems,
            hasPreviousPage: page > 1
        };

        return { items, meta };
    }

    async findByIdIncludingDeleted(id: string): Promise<User | null> {
        return this.users.find(user => user.id.value === id) || null;
    }
}