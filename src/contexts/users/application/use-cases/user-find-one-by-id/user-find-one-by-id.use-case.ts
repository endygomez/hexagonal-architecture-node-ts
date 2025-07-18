import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { UserFindOneByIdQuery } from "./user-find-one-by-id.query";
import { UserReadModel } from "../../read-models/user.read-model";

export class UserFindOneById {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(query: UserFindOneByIdQuery): Promise<UserReadModel> {
        const user = await this.userRepository.findOneById(query.id);

        if (!user) {
            throw new UserNotFoundError('User not found');
        }

        return user.toPrimitives();
    }
}   