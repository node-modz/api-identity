export interface Seeder {
    setup(file: string): void;
    tearDown(): void;
}