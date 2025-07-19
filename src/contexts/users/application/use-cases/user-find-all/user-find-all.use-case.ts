import { PaginatedResult } from "../../../../shared/domain/interfaces/pagination.interface";

import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserMapper } from "../../mappers/user.mapper";
import { UserReadModel } from "../../read-models/user.read-model";
import { QueryParamsDto } from "src/contexts/shared/infrastructure/dto/query-params.dto";

export class UserFindAll {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(params: QueryParamsDto): Promise<PaginatedResult<UserReadModel>> {
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