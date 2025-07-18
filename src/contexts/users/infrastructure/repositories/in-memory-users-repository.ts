import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";

export class InMemoryUsersRepository implements UserRepository {
    private users: User[] = [];

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    async findOneById(id: string): Promise<User | null> {
        return this.users.find(user => user.id.value === id) || null;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email.value === email) || null;
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

    async findAll(): Promise<User[]> {
        return this.users;
    }
}