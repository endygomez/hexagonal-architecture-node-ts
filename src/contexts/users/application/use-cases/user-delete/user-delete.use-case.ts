import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserDeleteCommand } from "./user-delete.command";
import { UserId } from "../../../domain/vo/user-id.vo";

export class UserDelete {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UserDeleteCommand): Promise<void> {
        const userId = new UserId(command.id);
        const user = await this.userRepository.findOneById(userId.value);

        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        user.markAsDeleted();
        await this.userRepository.delete(userId.value);
    }
}