import { createContext } from '@/lib/core/context/index.js';
import { if_expression } from '@/lib/core/expressions/if/index.js';
import { describe, expect, it } from 'vitest';

describe('if condition parser', () => {
    describe('check for example: if response.status == 200', () => {
        const context = createContext({
            response: {
                status: 200,
                type: 'success',
                headers: {
                    'content-type': 'application/json',
                },
                data: null,
            },
            valid: true,
            name: 'Marco',
            age: 25,
            settings: {
                enabled: true,
                mode: 'dark',
                features: ['a', 'b', 'c'],
                config: undefined,
            },
            items: [1, 2, 3, 4, 5],
            empty: [],
            permissions: ['read', 'write'],
            score: 85.5,
        });

        describe('.check', () => {
            it('returns true when expression starts with "if "', () => {
                expect(if_expression.check('if response.status == 200')).toBe(true);
            });

            it('returns false when doesnt start with "if "', () => {
                expect(if_expression.check('response.status == 200')).toBe(false);
            });
        });

        describe('.evaluate', () => {
            it('evaluates to true', () => {
                expect(if_expression.evaluate('if response.status == 200', context)).toBe(true);
            });

            it('evaluates to false', () => {
                expect(if_expression.evaluate('if response.status == 404', context)).toBe(false);
            });

            it('also evaluates to false when checking for strings', () => {
                expect(if_expression.evaluate('if response.status == "200"', context)).toBe(false);
                expect(if_expression.evaluate("if response.status == '200'", context)).toBe(false);
            });

            it('also supports "is" keyword', () => {
                expect(if_expression.evaluate('if response.status is 200', context)).toBe(true);
            });

            it('also supports "is not" keywords', () => {
                expect(if_expression.evaluate('if response.status is not 200', context)).toBe(false);
                expect(if_expression.evaluate('if response.status is not 400', context)).toBe(true);
            });

            it('also supports "!=" operator', () => {
                expect(if_expression.evaluate('if response.status != 200', context)).toBe(false);
                expect(if_expression.evaluate('if response.status != 400', context)).toBe(true);
            });

            it('supports "and" concatenation of expressions', () => {
                expect(if_expression.evaluate('if response.status == 200 and valid', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status == 200 and name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name == "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name is not "Marco"', context)).toBe(
                    false
                );
                expect(if_expression.evaluate('if response.status == 200 and name != "Marco"', context)).toBe(false);
                expect(if_expression.evaluate('if name is "Marco" and valid is not false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid != false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid is true', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid == true', context)).toBe(true);
            });

            it('supports unlimited "and" concatenations with mixed operators', () => {
                // Test with 3 conditions
                expect(
                    if_expression.evaluate('if response.status == 200 and name is "Marco" and valid is true', context)
                ).toBe(true);

                // Test with 4 conditions
                expect(
                    if_expression.evaluate(
                        'if response.status == 200 and name is "Marco" and valid and settings.enabled',
                        context
                    )
                ).toBe(true);

                // Test with 5 conditions including nested properties
                expect(
                    if_expression.evaluate(
                        'if response.status == 200 and name is "Marco" and valid and settings.enabled and settings.mode is "dark"',
                        context
                    )
                ).toBe(true);

                // Test with mixed operators and types
                expect(
                    if_expression.evaluate(
                        'if response.type is "success" and response.headers.content-type is "application/json" and age != 30 and settings.mode is not "light" and valid',
                        context
                    )
                ).toBe(true);
            });

            it('supports type-specific comparisons', () => {
                // String comparisons
                expect(if_expression.evaluate('if response.type is "success"', context)).toBe(true);
                expect(if_expression.evaluate('if settings.mode == "dark"', context)).toBe(true);

                // Numeric comparisons
                expect(if_expression.evaluate('if age == 25', context)).toBe(true);
                expect(if_expression.evaluate('if age is 25', context)).toBe(true);

                // Boolean values
                expect(if_expression.evaluate('if valid', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled is true', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled == true', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled != "true"', context)).toBe(true);
            });

            it('supports greater/less than comparisons', () => {
                expect(if_expression.evaluate('if age > 20', context)).toBe(true);
                expect(if_expression.evaluate('if age >= 25', context)).toBe(true);
                expect(if_expression.evaluate('if age < 30', context)).toBe(true);
                expect(if_expression.evaluate('if age <= 25', context)).toBe(true);
                expect(if_expression.evaluate('if score > 80', context)).toBe(true);
                expect(if_expression.evaluate('if score <= 85.5', context)).toBe(true);
            });

            it('supports array contains/includes checks', () => {
                expect(if_expression.evaluate('if "b" in settings.features', context)).toBe(true);
                expect(if_expression.evaluate('if "d" in settings.features', context)).toBe(false);
                expect(if_expression.evaluate('if "write" in permissions', context)).toBe(true);
                expect(if_expression.evaluate('if 3 in items', context)).toBe(true);
            });

            it('supports "or" operator', () => {
                expect(if_expression.evaluate('if age == 25 or age == 30', context)).toBe(true);
                expect(if_expression.evaluate('if name is "John" or name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if age < 20 or age > 24', context)).toBe(true);
            });

            it('supports "not" operator', () => {
                expect(if_expression.evaluate('if not valid is false', context)).toBe(true);
                expect(if_expression.evaluate('if not (age < 20)', context)).toBe(true);
                expect(if_expression.evaluate('if not ("admin" in permissions)', context)).toBe(true);
            });

            it('supports property existence checks', () => {
                expect(if_expression.evaluate('if "status" in response', context)).toBe(true);
                expect(if_expression.evaluate('if "unknown" in response', context)).toBe(false);
                expect(if_expression.evaluate('if "content-type" in response.headers', context)).toBe(true);
            });

            it('supports null/undefined checks', () => {
                expect(if_expression.evaluate('if response.data is null', context)).toBe(true);
                expect(if_expression.evaluate('if response.data is undefined', context)).toBe(false);
                expect(if_expression.evaluate('if settings.config is undefined', context)).toBe(true);
                expect(if_expression.evaluate('if settings.config is null', context)).toBe(false);
                expect(if_expression.evaluate('if settings.unexisting is undefined', context)).toBe(true);
                expect(if_expression.evaluate('if settings.config is nil', context)).toBe(true);
                expect(if_expression.evaluate('if response.data is nil', context)).toBe(true);
                expect(if_expression.evaluate('if settings.unexisting is nil', context)).toBe(true);
                expect(if_expression.evaluate('if name is not null', context)).toBe(true);
                expect(if_expression.evaluate('if settings.mode is not undefined', context)).toBe(true);
            });

            it('supports parentheses for grouping', () => {
                expect(if_expression.evaluate('if (age > 20 and age < 30) or name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if not (age < 20 or age > 30)', context)).toBe(true);
                expect(
                    if_expression.evaluate(
                        'if (name is "Marco" and age == 25) or (name is "John" and age == 30)',
                        context
                    )
                ).toBe(true);
            });
        });
    });
});
