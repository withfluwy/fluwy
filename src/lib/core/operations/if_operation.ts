import { Operation } from '../constants';
import type { Operation as OperationHandler } from '../contracts';
import { compile } from '../utils/compile';

export const if_operation: OperationHandler = (params, context) => {
	return new Promise((resolve, reject) => {
		let condition = compile(params, context.data);

		const passes = condition !== params && Boolean(condition);

		passes ? resolve(passes) : reject(Operation.Cancelled);
	});
};
