import { IdGenerator } from "../../domain/services/id-generator.interface";

import { generateUuidV4, isValidUuidV4 } from "../../../../contexts/shared/utils/uuid";


export class IdGeneratorService implements IdGenerator {
  generate(): string {
    return generateUuidV4();
  }

  isValid(id: string): boolean {
    return isValidUuidV4(id);
  }
}