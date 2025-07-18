export interface IdGenerator {
    generate(): string;
    isValid(id: string): boolean;
}
