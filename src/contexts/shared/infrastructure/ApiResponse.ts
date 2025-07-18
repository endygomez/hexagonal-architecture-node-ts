import { PaginationMeta } from "../domain/PaginationParams";

export interface ApiResponse<T> {
    error: boolean;
    data: T;
    message?: string;
    meta?: PaginationMeta | Record<string, unknown>;
}

export function successResponse<T>(data: T, message?: string, meta?: Record<string, unknown>): ApiResponse<T> {
    return { error: false, data, message, meta };
}

export function paginatedResponse<T>(
    data: T[],
    meta: PaginationMeta | Record<string, unknown>,
    message?: string
): ApiResponse<T[]> {
    return { error: false, data, message, meta }
}

export function errorResponse<T>(message: string, data?: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return { error: true, data: data ?? (null as any), message, meta };
}