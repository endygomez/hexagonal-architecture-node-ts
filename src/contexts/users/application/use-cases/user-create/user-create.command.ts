export class UserCreateCommand {
    constructor(
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
    ) {}
  }