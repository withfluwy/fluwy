import type { Any } from '../core/contracts';
import * as columns from './columns';

export interface Table {
	/**
	 * The unique identifier for the table
	 */
	id: string;
	/**
	 * The URL to fetch the data from
	 */
	url: string;

	pagination?: TablePagination;

	columns: Column[];
	/**
	 * The credentials policy to use for the request. Can be one of:
	 * - `omit`: The request will not include any cookies or authentication headers.
	 * - `same-origin`: The request will include cookies and authentication headers if the URL is on the same origin as the calling script.
	 * - `include`: The request will include cookies and authentication headers.
	 * @default "omit"
	 */
	credentials?: 'omit' | 'same-origin' | 'include';
	/**
	 * Defines the behaviour of when a row is clicked.
	 */
	on_row_click?: {
		/**
		 * The URI to navigate to when a row is clicked. It can be full url.
		 */
		goto?: string;
		/**
		 * The flag to open the URI in a new tab.
		 * @default false
		 */
		new_tab?: boolean;
	};
}

export interface TablePagination {
	params?: TablePaginationParams;

	paths?: {
		/**
		 * The path to the data in the response from the root. For example if your endpoint return a json body like
		 * ```json
		 * {
		 *  "data": [...],
		 *  ...
		 * }
		 * ```
		 * then the results would be in "data". And you would set this to "data".
		 * @default "results"
		 */
		results?: string;
		/**
		 * The path to the count in the response from the root. For example if your endpoint return a json body like
		 * ```json
		 * {
		 *  "total": 10
		 *  ...
		 * }
		 * ```
		 * then the count would be in "total".
		 * @default "count"
		 */
		count?: string;
	};
}

export interface TablePaginationParams {
	/**
	 * The name of the page parameter in the URL.
	 * @default "page"
	 */
	page?: string;
	/**
	 * The name of the page size parameter in the URL.
	 * @default "page_size"
	 */
	page_size?: string;
}

export type ColumnType = keyof typeof columns;
export interface ColumnSchema {
	header: string;
	path?: string;
	type?: ColumnType;
	class?: string;
}

interface CustomColumnSchema {
	type: 'custom';
	content: Any;
}

export type Column = ColumnSchema &
	CustomColumnSchema & {
		value: Any;
		record: Record<string, Any>;
	};

export interface PaginationProps {
	for: string;
}

export interface PaginationPayload {
	page: number;
	pageSize: number;
	count: number;
	recordsLength: number;
}

export interface Paginate {
	page: number;
	pageSize: number;
}
