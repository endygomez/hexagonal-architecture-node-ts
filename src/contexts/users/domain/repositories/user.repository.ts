import { User } from "../entities/user.entity";
import { UserId } from "../vo/user-id.vo";

export interface UserRepository {
    create(user: User): Promise<void>;
    findOneById(id: UserId): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(id: UserId): Promise<void>;
}