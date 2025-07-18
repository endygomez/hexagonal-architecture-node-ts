import { FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";

import { ServiceContainer } from "../../../shared/infrastructure/ServiceContainer";
import { formatZodError } from "../../../shared/utils/zod-error.formatter";
import { errorResponse, paginatedResponse, successResponse } from "../../../shared/infrastructure/ApiResponse";

import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";
import { UserCreateDtoSchema } from "../dto/user-create.dto";
import { UserMapper } from "../mappers/user.mapper";
import { UserFindOneByIdQuery } from "../../application/use-cases/user-find-one-by-id/user-find-one-by-id.query";
import { UserDeleteCommand } from "../../application/use-cases/user-delete/user-delete.command";
import { UserUpdateDto, UserUpdateDtoSchema } from "../dto/user-update.dto";
import { QueryParams, SortOrder } from "src/contexts/shared/utils/query-builder/query-builder.interface";
import { QueryParamsSchema } from "src/contexts/shared/infrastructure/dto/query-params.schema";


export class FastifyUserController {
    constructor() { }

    async findAll(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
        try {
            const params = QueryParamsSchema.parse(request.query);
            const result = await ServiceContainer.user.findAll.execute(params);

            return reply.status(200).send(paginatedResponse(result.items, result.meta));

        } catch (error) {
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    error: true,
                    message: "Validation failed",
                    details: formatZodError(error)
                });
            }
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

            return reply.status(200).send(successResponse(UserMapper.readModelToResponse(user)));
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                return reply.status(404).send(errorResponse(error.message));
            }
            reply.status(500).send(errorResponse('Internal server error'));
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const dto = UserCreateDtoSchema.parse(request.body);
            const command = UserMapper.toCreateCommand(dto);
            await ServiceContainer.user.create.execute(command);
            return reply.status(201).send(successResponse(null));
        } catch (error) {
            console.error('Error in create user:', error);
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    error: true,
                    message: "Validation failed",
                    details: formatZodError(error)
                });
            }
            if (error instanceof Error) {
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                reply.status(500).send(errorResponse(error.message));
            } else {
                reply.status(500).send(errorResponse('Internal server error'));
            }
        }
    }

    async update(request: FastifyRequest<{ Params: { id: string }, Body: UserUpdateDto }>, reply: FastifyReply) {
        try {
            const id = z.uuid().parse(request.params.id);
            const body = UserUpdateDtoSchema.parse(request.body);

            const command = UserMapper.toUpdateCommand(id, body);

            await ServiceContainer.user.update.execute(command);

            return reply.status(204).send(successResponse(null));

        } catch (error) {
            if (error instanceof UserNotFoundException) {
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
            if (error instanceof UserNotFoundException) {
                return reply.status(404).send(errorResponse(error.message));
            }
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    error: true,
                    message: "Validation failed",
                    details: formatZodError(error)
                });
            }
            if (error instanceof Error) {
                // Handle specific error for already deleted users
                if (error.message === "User is already deleted") {
                    return reply.status(409).send(errorResponse("User is already deleted"));
                }
                console.error('Error in delete user:', error);
                reply.status(500).send(errorResponse(error.message));
            } else {
                reply.status(500).send(errorResponse('Internal server error'));
            }
        }
    }
}