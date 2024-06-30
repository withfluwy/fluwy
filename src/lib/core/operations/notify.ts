import { toast } from 'svelte-sonner';
import type { Operation } from '../contracts';
import { compile } from '../utils/compile';

export const notify: Operation = async (props: string | NotifyProps, context) => {
	if (typeof props === 'string') return toast.success(compile(props, context.data));

	if (props.error) return toast.error(compile(props.error, context.data));
	if (props.success) return toast.success(compile(props.success, context.data));
	if (props.info) return toast.info(compile(props.info, context.data));
	if (props.warning) return toast.warning(compile(props.warning, context.data));

	return toast(compile(props.message, context.data));
};

export interface NotifyProps {
	message: string;
	error?: string;
	success?: string;
	info?: string;
	warning?: string;
}
