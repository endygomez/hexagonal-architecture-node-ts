import { UserRepository } from "../../../domain/repositories/user.repository";
import { toReadModel } from "../../mappers/user.mapper";
import { UserReadModel } from "../../read-models/user.read-model";

export class UserFindAll {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserReadModel[]> {
        const users = await this.userRepository.findAll();

        return users.map(toReadModel);    
    }
}