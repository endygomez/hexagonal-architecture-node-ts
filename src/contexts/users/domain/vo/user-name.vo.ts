export class UserName {
    public readonly value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid(): void {
        if (!this.value) {
            throw new Error('Name is required');
        }
        if (this.value.length < 3) {
            throw new Error('Name must be at least 3 characters long');
        }
    }

    public equals(other: UserName): boolean {
        if (!other) return false;
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}