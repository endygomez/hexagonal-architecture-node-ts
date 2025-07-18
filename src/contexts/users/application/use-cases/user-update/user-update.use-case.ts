import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserUpdateCommand } from "./user-update.command";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserName } from "../../../domain/vo/user-name.vo";
import { UserEmail } from "../../../domain/vo/user-email.vo";
import { UserId } from "../../../domain/vo/user-id.vo";
    
export class UserUpdate {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UserUpdateCommand): Promise<void> {
        const userId = new UserId(command.id);
        const user = await this.userRepository.findOneById(userId.value);

        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        if (command.name !== undefined) {
            const newName = new UserName(command.name);
            if (!user.name.equals(newName)) {
                user.changeName(newName);
            }
        }

        if (command.email !== undefined) {
            const newEmail = new UserEmail(command.email);
            if (!user.email.equals(newEmail)) {
                user.changeEmail(newEmail);
            }
        }

        await this.userRepository.update(user);
    }
}