import { IdGenerator } from "../../../domain/services/id-generator.interface";
import { PasswordHasher } from "../../../domain/services/password-hasher.interface";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserCreateCommand } from "./user-create.command";

export class UserCreate {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly idGenerator: IdGenerator,
        private readonly passwordHash: PasswordHasher
    ) { }

    async execute(command: UserCreateCommand): Promise<void> {
        const id = this.idGenerator.generate();
        const passwordHash = await this.passwordHash.hash(command.password);
        
        const user = User.create(
            id,
            command.name,
            command.email,
            passwordHash
        );

        await this.userRepository.create(user);
    }
}