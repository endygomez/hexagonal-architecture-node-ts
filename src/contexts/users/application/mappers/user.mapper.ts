import { User } from "../../domain/entities/user.entity";
import { UserReadModel } from "../read-models/user.read-model";

export const toReadModel = (user: User): UserReadModel => ({
    id:    user.id.value,
    name:  user.name.value,
    email: user.email.value,
  });