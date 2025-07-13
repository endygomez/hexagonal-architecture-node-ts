import { Pool } from "pg";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserId } from "../../domain/vo/user-id.vo";
import { UserName } from "../../domain/vo/user-name.vo";
import { UserEmail } from "../../domain/vo/user-email.vo";
import { UserCreatedAt } from "../../domain/vo/user-create-at.vo";
import { UserUpdatedAt } from "../../domain/vo/user-update-at.vo";
import { UserDeletedAt } from "../../domain/vo/user-delete-at.vo";

type PostgresUser = {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export class PostgresUsersRepository implements UserRepository {
    client: Pool;

    constructor(private readonly databaseUrl: string) {
        this.client = new Pool({
            connectionString: this.databaseUrl,
        });

        this.client.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    async create(user: User): Promise<void> {
        const query = {
            text: `
                INSERT INTO users (id, name, email, created_at)
                VALUES ($1, $2, $3, $4)
            `,
            values: [user.id.value, user.name.value, user.email.value, user.createdAt.value],
        };
        await this.client.query(query);
    }

    async findOneById(id: UserId): Promise<User | null> {
        const query = {
            text: `
                SELECT * FROM users WHERE id = $1
            `,
            values: [id.value],
        };
        const result = await this.client.query(query);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        return this.mapToDomain(user);
    }

    async findAll(): Promise<User[]> {
        const query = {
            text: `
                SELECT * FROM users
            `,
        };
        const result = await this.client.query(query);
        return result.rows.map(row => this.mapToDomain(row));
    }

    async update(user: User): Promise<void> {
        const query = {
            text: `
                UPDATE users SET name = $1, email = $2, created_at = $3 WHERE id = $4
            `,
            values: [user.name.value, user.email.value, user.createdAt.value, user.id.value],
        };
        await this.client.query<PostgresUser>(query);
    }

    async delete(id: UserId): Promise<void> {
        const query = {
            text: `
                DELETE FROM users WHERE id = $1
            `,
            values: [id.value],
        };
        await this.client.query(query);
    }

    private mapToDomain(user: PostgresUser): User {
        return new User(
            new UserId(user.id),
            new UserName(user.name),
            new UserEmail(user.email),
            new UserCreatedAt(user.created_at),
            new UserUpdatedAt(user.updated_at),
            new UserDeletedAt(user.deleted_at)
        );
    }
}

