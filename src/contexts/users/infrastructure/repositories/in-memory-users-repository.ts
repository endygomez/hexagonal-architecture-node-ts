import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UserId } from "../../domain/vo/user-id.vo";

export class InMemoryUsersRepository implements UserRepository {
    private users: User[] = [];

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    async findOneById(id: UserId): Promise<User | null> {
        return this.users.find(user => user.id.value === id.value) || null;
    }

    async update(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.id.value === user.id.value);
        if (index !== -1) {
            this.users[index] = user;
        }
    }

    async delete(id: UserId): Promise<void> {
        this.users = this.users.filter(user => user.id.value !== id.value);
    }

    async findAll(): Promise<User[]> {
        return this.users;
    }
}