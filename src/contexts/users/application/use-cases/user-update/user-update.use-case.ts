import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserUpdateCommand } from "./user-update.command";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserName } from "../../../domain/vo/user-name.vo";
import { UserEmail } from "../../../domain/vo/user-email.vo";
    
export class UserUpdate {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UserUpdateCommand): Promise<void> {
        const user = await this.userRepository.findOneById(command.id);

        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        if (command.name !== undefined && command.name !== user.name.value) {
            user.changeName(new UserName(command.name));
        }

        if (command.email !== undefined && command.email !== user.email.value) {
            user.changeEmail(new UserEmail(command.email));
        }

        await this.userRepository.update(user);
    }
}