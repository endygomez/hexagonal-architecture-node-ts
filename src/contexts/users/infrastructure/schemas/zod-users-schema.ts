import { UserCreateRequestDto, UserUpdateRequestDto } from "../../../shared/infrastructure/dtos";
import { z } from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
}).strict() satisfies z.ZodType<UserCreateRequestDto>;

export const userUpdateSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),
    email: z.email(),
}).strict() satisfies z.ZodType<UserUpdateRequestDto>;