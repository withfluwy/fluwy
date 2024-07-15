import { Operation } from '../constants.js';
import type { Operation as OperationHandler } from '../contracts.js';
import { compile } from '../utils/compile/index.js';

export const if_operation: OperationHandler = (params, context) => {
    return new Promise((resolve, reject) => {
        const condition = compile(params, context.data);

        const passes = condition !== params && Boolean(condition);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        passes ? resolve(passes) : reject(Operation.Cancelled);
    });
};
