import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserNotFoundException } from "../../../domain/exceptions/user-not-found.exception";
import { UserDeleteCommand } from "./user-delete.command";
import { UserId } from "../../../domain/vo/user-id.vo";

export class UserDelete {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UserDeleteCommand): Promise<void> {
        const userId = new UserId(command.id);
        const user = await this.userRepository.findByIdIncludingDeleted(userId.value);

        if (!user) {
            throw new UserNotFoundException("User not found");
        }

        if (user.isDeleted) {
            throw new Error("User is already deleted");
        }

        // Soft delete: mark as deleted instead of physically removing
        user.markAsDeleted();
        await this.userRepository.update(user);
    }
}