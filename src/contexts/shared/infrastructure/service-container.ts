import { UserFindAll } from "../../users/application/use-cases/user-find-all/user-find-all.use-case";
import { UserCreate } from "../../users/application/use-cases/user-create/user-create.use-case";
import { UserUpdate } from "../../users/application/use-cases/user-update/user-update.use-case";
import { UserDelete } from "../../users/application/use-cases/user-delete/user-delete.use-case";
import { UserFindOneById } from "../../users/application/use-cases/user-find-one-by-id/user-find-one-by-id.use-case";
import { PasswordHasherService } from "src/contexts/users/infrastructure/services/password-hasher.service";
import { IdGeneratorService } from "src/contexts/users/infrastructure/services/id-generator.service";
import { PostgresUsersRepository } from "src/contexts/users/infrastructure/repositories/postgres-users-repository";
import { postgresPool, validateDatabaseConnection } from "./db/postgres-pool";

const userRepository = new PostgresUsersRepository(postgresPool);
const idGenerator = new IdGeneratorService();
const passwordHasher = new PasswordHasherService();

export const ServiceContainer = {
    user: {
        findAll: new UserFindAll(userRepository),
        findOneById: new UserFindOneById(userRepository),
        create: new UserCreate(userRepository, idGenerator, passwordHasher),
        update: new UserUpdate(userRepository),
        delete: new UserDelete(userRepository),
    }
}

export const initializeServices = async (): Promise<void> => {
    try {
        console.log('Validating database connection...');
        await validateDatabaseConnection();
        console.log('Database connection validated successfully.');
    } catch (error) {
        console.error('Service initialization failed:', error);
        process.exit(1);
    }
}