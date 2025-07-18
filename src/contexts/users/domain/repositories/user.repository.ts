import { User } from "../entities/user.entity";

export interface UserRepository {
    create(user: User): Promise<void>;
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}