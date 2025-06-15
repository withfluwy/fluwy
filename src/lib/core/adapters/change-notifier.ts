export class ChangeNotifier {
    private listeners: Set<(...args: unknown[]) => void> = new Set();

    public onChange(callback: (...args: unknown[]) => void) {
        this.listeners.add(callback);
    }

    public removeListener(callback: (...args: unknown[]) => void) {
        this.listeners.delete(callback);
    }

    public notifyChanges(...args: unknown[]) {
        for (const listener of this.listeners) {
            listener(...args);
        }
    }
}
