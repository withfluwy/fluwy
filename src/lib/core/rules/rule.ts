export interface Rule {
    field: string;
    message: string;
    check(value: unknown): Promise<boolean>;
}
