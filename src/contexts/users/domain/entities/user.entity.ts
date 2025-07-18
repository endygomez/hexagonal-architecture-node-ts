import { UserId } from "../vo/user-id.vo";
import { UserCreatedAt } from "../vo/user-created-at.vo";
import { UserName } from "../vo/user-name.vo";
import { UserEmail } from "../vo/user-email.vo";
import { UserUpdatedAt } from "../vo/user-updated-at.vo";
import { UserDeletedAt } from "../vo/user-deleted-at.vo";
import { UserPassword } from "../vo/user-password.vo";

export class User {
    private readonly _id: UserId;
    private _name: UserName;
    private _email: UserEmail;
    private readonly _passwordHash: UserPassword;
    private readonly _createdAt: UserCreatedAt;
    private _updatedAt: UserUpdatedAt;
    private _deletedAt: UserDeletedAt;

    private constructor(
        id: UserId,
        name: UserName,
        email: UserEmail,
        passwordHash: UserPassword,
        createdAt: UserCreatedAt,
        updatedAt: UserUpdatedAt,
        deletedAt: UserDeletedAt
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._passwordHash = passwordHash;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this.ensureValidState();
    }

    private ensureValidState(): void {
        if (this._deletedAt.value && !this._updatedAt.value) {
            throw new Error('A deleted user must have an update date');
        }
    }

    get id(): UserId {
        return this._id;
    }

    get name(): UserName {
        return this._name;
    }

    get email(): UserEmail {
        return this._email;
    }

    get passwordHash(): UserPassword {
        return this._passwordHash;
    }

    get createdAt(): UserCreatedAt {
        return this._createdAt;
    }

    get updatedAt(): UserUpdatedAt {
        return this._updatedAt;
    }

    get deletedAt(): UserDeletedAt {
        return this._deletedAt;
    }

    get isDeleted(): boolean {
        return this._deletedAt.value !== null;
    }

    static create(
        id: string,
        name: string,
        email: string,
        passwordHash: string
    ): User {
        const now = new Date();

        return new User(
            new UserId(id),
            new UserName(name),
            new UserEmail(email),
            new UserPassword(passwordHash),
            new UserCreatedAt(now),
            new UserUpdatedAt(now),
            new UserDeletedAt(null)
        );
    }

    changeName(newName: UserName): void {
        if (this.isDeleted) {
            throw new Error('Cannot change name of deleted user');
        }
        if (this._name.equals(newName)) return;
        
        this._name = newName;
        this.touchUpdatedAt();
    }

    changeEmail(newEmail: UserEmail): void {
        if (this.isDeleted) {
            throw new Error('Cannot change email of deleted user');
        }
        if (this._email.equals(newEmail)) return;
        
        this._email = newEmail;
        this.touchUpdatedAt();
    }

    delete(): void {
        if (this.isDeleted) {
            throw new Error('User is already deleted');
        }
        this._deletedAt = new UserDeletedAt(new Date());
        this.touchUpdatedAt();
    }

    private touchUpdatedAt(): void {
        this._updatedAt = new UserUpdatedAt(new Date());
    }

    toPrimitives() {
        return {
            id: this._id.value,
            name: this._name.value,
            email: this._email.value,
            createdAt: this._createdAt.value,
            updatedAt: this._updatedAt.value,
            deletedAt: this._deletedAt.value,
            passwordHash: this._passwordHash.value,
        };
    }
}