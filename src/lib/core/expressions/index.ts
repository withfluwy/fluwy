import type { Context } from '@/lib/core/contracts.js';

export const Expression = {
    if(expression: string, context: Context): boolean {
        console.log('if expression called with', { expression, context: context.data });

        return true;
    },
};
