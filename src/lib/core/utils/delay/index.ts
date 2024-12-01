type DelayParams = {
    /**
     * The delay in milliseconds
     */
    after: number;
    /**
     * The condition that must be true for the callback to be executed
     */
    if?: () => boolean;
};

export function delay(callback: () => void, { after, if: condition = () => true }: DelayParams): void {
    if (!condition()) return;

    setTimeout(() => {
        if (!condition()) return;
        callback();
    }, after);
}
