import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserId } from "../../../domain/vo/user-id.vo";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserDeleteCommand } from "./user-delete.command";

export class UserDelete {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: UserDeleteCommand): Promise<void> {
        const user = await this.userRepository.findOneById(new UserId(command.id));

        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        await this.userRepository.delete(new UserId(command.id));
    }
}