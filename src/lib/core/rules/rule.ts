export interface Rule {
    id: string;
    message: string;
    check(value: unknown): Promise<boolean>;
}
