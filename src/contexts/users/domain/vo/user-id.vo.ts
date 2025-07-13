import { isValidUuidV4 } from "../../../shared/infrastructure/utils/uuid-generator";

export class UserId {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid() {
        if (!this.value) {
            throw new Error('Id is required');
        }
        if (!isValidUuidV4(this.value)) {
            throw new Error('Id must be a valid UUID v4');
        }
    }
}