import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserMapper } from "../../mappers/user.mapper";
import { UserReadModel } from "../../read-models/user.read-model";

export class UserFindAll {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserReadModel[]> {
        const users = await this.userRepository.findAll();

        return users.map(UserMapper.toReadModel);
    }
}