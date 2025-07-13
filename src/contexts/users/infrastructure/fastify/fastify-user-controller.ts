import { FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";

import { ServiceContainer } from "../../../shared/infrastructure/ServiceContainer";
import { formatZodError } from "../../../shared/infrastructure/utils/zod-error.formatter";
import { errorResponse, successResponse } from "../../../shared/infrastructure/ApiResponse";

import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import { UserCreateDtoSchema } from "../dto/user-create.dto";
import { readModelToResponse, toCreateCommand, toUpdateCommand } from "../mappers/user.mapper";
import { UserFindOneByIdQuery } from "../../application/use-cases/user-find-one-by-id/user-find-one-by-id.query";
import { UserDeleteCommand } from "../../application/use-cases/user-delete/user-delete.command";
import { UserUpdateDto, UserUpdateDtoSchema } from "../dto/user-update.dto";
import { UserUpdateCommand } from "../../application/use-cases/user-update/user-update.command";

export class FastifyUserController {
    constructor() { }

    async findAll(_: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await ServiceContainer.user.findAll.execute();
            return reply.status(200).send(successResponse(users));

        } catch (error) {
            if (error instanceof Error) {
                reply.status(500).send(errorResponse(error.message));
            } else {
                reply.status(500).send(errorResponse('Internal server error'));
            }
        }
    }

    async findOneById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const id = z.uuid().parse(request.params.id);
            const query = new UserFindOneByIdQuery(id);
            const user = await ServiceContainer.user.findOneById.execute(query);

            return reply.status(200).send(successResponse(readModelToResponse(user)));
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return reply.status(404).send(errorResponse(error.message));
            }
            reply.status(500).send(errorResponse('Internal server error'));
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const dto = UserCreateDtoSchema.parse(request.body);
            const command = toCreateCommand(dto);
            await ServiceContainer.user.create.execute(command);
            return reply.status(201).send(successResponse(null));
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    error: true,
                    message: "Validation failed",
                    details: formatZodError(error)
                });
            }
            console.log('Seguimos 2', error);
            reply.status(500).send(errorResponse('Internal server error'));
        }
    }

    async update(request: FastifyRequest<{ Params: { id: string }, Body: UserUpdateDto }>, reply: FastifyReply) {
        try {
            const id = z.uuid().parse(request.params.id);
            const body = UserUpdateDtoSchema.parse(request.body);

            const command = toUpdateCommand(id, body);

            await ServiceContainer.user.update.execute(command);

            return reply.status(204).send(successResponse(null));

        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return reply.status(404).send(errorResponse(error.message));
            }
            reply.status(500).send(errorResponse('Internal server error'));
        }
    }

    async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const id = z.uuid().parse(request.params.id);
            const command = new UserDeleteCommand(id);
            await ServiceContainer.user.delete.execute(command);

            return reply.status(204).send(successResponse(null));
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return reply.status(404).send(errorResponse(error.message));
            }
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    error: true,
                    message: "Validation failed",
                    details: formatZodError(error)
                });
            }
            reply.status(500).send(errorResponse('Internal server error'));
        }
    }
}