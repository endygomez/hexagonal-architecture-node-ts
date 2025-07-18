import { UserCreateCommand } from "../../application/use-cases/user-create/user-create.command";
import { UserCreateDto } from "../dto/user-create.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UserReadModel } from "../../application/read-models/user.read-model";
import { UserUpdateCommand } from "../../application/use-cases/user-update/user-update.command";
import { UserUpdateDto } from "../dto/user-update.dto";

export class UserMapper {

    static toCreateCommand = (dto: UserCreateDto): UserCreateCommand =>
        new UserCreateCommand(dto.name, dto.email, dto.password);

    static toUpdateCommand = (id: string, dto: UserUpdateDto): UserUpdateCommand =>
        new UserUpdateCommand(id, dto.name, dto.email);

    static readModelToResponse = (user: UserReadModel): UserResponseDto => ({
        id: user.id,
        name: user.name,
        email: user.email,
    })
}