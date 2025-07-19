import { QueryParams } from "../../../shared/utils/query-builder/query-builder.interface";
import { PaginatedResult } from "../../../shared/domain/interfaces/pagination.interface";
import { User } from "../entities/user.entity";

export interface UserRepository {
    create(user: User): Promise<void>;
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    findAll(params: QueryParams): Promise<PaginatedResult<User>>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findByIdIncludingDeleted(id: string): Promise<User | null>;
}