import { UserId } from "../vo/user-id.vo";
import { UserCreatedAt } from "../vo/user-create-at.vo";
import { UserName } from "../vo/user-name.vo";
import { UserEmail } from "../vo/user-email.vo";
import { UserUpdatedAt } from "../vo/user-update-at.vo";
import { UserDeletedAt } from "../vo/user-delete-at.vo";
import { UserPassword } from "../vo/user-password.vo";

export class User {
    private constructor(
        public readonly id: UserId,
        public name: UserName,
        public email: UserEmail,
        public password: UserPassword,
        public readonly createdAt: UserCreatedAt,
        public updatedAt: UserUpdatedAt,
        public deletedAt: UserDeletedAt
    ) { }

    static create(
        id: string,
        name: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date
    ): User {
        return new User(
            new UserId(id),
            new UserName(name),
            new UserEmail(email),
            new UserPassword(password),
            new UserCreatedAt(createdAt),
            new UserUpdatedAt(updatedAt),
            new UserDeletedAt(deletedAt)
        );
    }

    changeName(newName: UserName) {
        if (this.name.value === newName.value) return;
        this.name = newName;
        this.touchUpdatedAt();
    }

    changeEmail(newEmail: UserEmail) {
        if (this.email.value === newEmail.value) return;
        this.email = newEmail;
        this.touchUpdatedAt();
    }

    private touchUpdatedAt() {
        this.updatedAt = new UserUpdatedAt(new Date());
    }

    toPrimitives() {
        return {
            id: this.id.value,
            name: this.name.value,
            email: this.email.value,
            createdAt: this.createdAt.value,
            updatedAt: this.updatedAt.value,
            deletedAt: this.deletedAt.value,
            password: this.password.value,
        };
    }
}