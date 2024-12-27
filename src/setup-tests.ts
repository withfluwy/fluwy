import { afterEach, vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Setup afterEach cleanup
afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.restoreAllMocks();
});
