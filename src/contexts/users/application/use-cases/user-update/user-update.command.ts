export class UserUpdateCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly email?: string,
    ) {}
}