import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserFindOneByIdQuery } from "./user-find-one-by-id.query";
import { UserReadModel } from "../../read-models/user.read-model";
import { UserId } from "../../../domain/vo/user-id.vo";
import { UserMapper } from "../../mappers/user.mapper";

export class UserFindOneById {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(query: UserFindOneByIdQuery): Promise<UserReadModel> {
        const userId = new UserId(query.id);
        const user = await this.userRepository.findOneById(userId.value);

        if (!user) {
            throw new UserNotFoundError('User not found');
        }

        return UserMapper.toReadModel(user);
    }
}   