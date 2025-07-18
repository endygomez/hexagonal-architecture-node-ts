import { IdGenerator } from "../../../domain/services/id-generator.interface";
import { PasswordHasher } from "../../../domain/services/password-hasher.interface";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserCreateCommand } from "./user-create.command";
import { UserId } from "../../../domain/vo/user-id.vo";
import { UserName } from "../../../domain/vo/user-name.vo";
import { UserEmail } from "../../../domain/vo/user-email.vo";
import { UserPassword } from "../../../domain/vo/user-password.vo";

export class UserCreate {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly idGenerator: IdGenerator,
        private readonly passwordHash: PasswordHasher
    ) { }

    async execute(command: UserCreateCommand): Promise<void> {
        const userId = new UserId(this.idGenerator.generate());
        const userName = new UserName(command.name);
        const userEmail = new UserEmail(command.email);
        const hashedPassword = await this.passwordHash.hash(command.password);
        const userPassword = new UserPassword(hashedPassword);
        
        const user = User.create(
            userId.value,
            userName.value,
            userEmail.value,
            userPassword.value
        );

        await this.userRepository.create(user);
    }
}