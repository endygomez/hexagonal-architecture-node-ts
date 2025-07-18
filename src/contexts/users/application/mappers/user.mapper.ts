import { User } from "../../domain/entities/user.entity";
import { UserReadModel } from "../read-models/user.read-model";

export class UserMapper {
  static toReadModel(user: User): UserReadModel {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
    }
  }
}