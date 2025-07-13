import { IdGeneratorRepository } from "../../../../shared/domain/repositories/id-generator.repository";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserCreateCommand } from "./user-create.command";

export class UserCreate {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly idGenerator: IdGeneratorRepository
    ) { }

    async execute(command: UserCreateCommand): Promise<void> {
        const id = this.idGenerator.generate();
        
        const user = User.create(
            id,
            command.name,
            command.email,
            command.password,
            new Date(),
            new Date(),
            new Date()
        );

        await this.userRepository.create(user);
    }
}