export interface UserCreateRequestDto {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateRequestDto {
    name: string;
    email: string;
}