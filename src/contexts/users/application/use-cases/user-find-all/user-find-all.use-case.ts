import { QueryParams } from "../../../../shared/utils/query-builder/query-builder.interface";
import { PaginatedResult } from "../../../../shared/domain/PaginationParams";

import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserMapper } from "../../mappers/user.mapper";
import { UserReadModel } from "../../read-models/user.read-model";

export class UserFindAll {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(params: QueryParams): Promise<PaginatedResult<UserReadModel>> {
        const { items: users, meta } = await this.userRepository.findAll(params);

        if (!users.length) {
            return {
                items: [],
                meta
            };
        }

        return {
            items: users.map(user => UserMapper.toReadModel(user)),
            meta
        };
    }
}