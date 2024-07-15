import { describe, expect, it } from 'vitest';
import { Random } from './index.js';

describe('Random', () => {
    describe('id', () => {
        it('should return a random ID with 17 characters', () => {
            expect(Random.id()).toHaveLength(17);
        });

        it('accepts a length parameter', () => {
            expect(Random.id(1)).toHaveLength(1);
            expect(Random.id(100)).toHaveLength(100);
        });
    });
});
