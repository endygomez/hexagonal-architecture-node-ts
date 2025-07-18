export class UserEmail {
    public readonly value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid(): void {
        if (!this.value) {
            throw new Error('Email is required');
        }
        // Validación simple, puedes mejorar con regex si lo deseas
        if (!this.value.includes('@')) {
            throw new Error('Invalid email format');
        }
    }

    public equals(other: UserEmail): boolean {
        if (!other) return false;
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}