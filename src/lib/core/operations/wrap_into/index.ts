import type { Operation } from '../../contracts';

export const wrap_into: Operation = async (wrapper: string, _, result) => {
	return {
		[wrapper]: result,
	};
};
