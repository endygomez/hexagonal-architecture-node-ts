import { randomUUID } from 'crypto';
import { IdGeneratorRepository } from '../../domain/repositories/id-generator.repository';

export class CryptoUuidGenerator implements IdGeneratorRepository {
  generate(): string {
    console.log('Generating UUID...');
    return randomUUID();
  }
}