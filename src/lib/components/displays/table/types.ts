import type { Any } from '@/lib/core/contracts.js';

export interface Table {
    /**
     * The unique identifier for the table
     */
    id: string;

    /**
     * The URL to fetch the data from
     */
    url: string;

    /**
     * The parameters to use for the table.
     */
    params?: TableParams;

    /**
     * The paths to data and count in the response from the root.
     */
    paths?: TablePaths;

    /**
     * The sorting options to apply to the table.
     */
    sort?: TableSort;

    /**
     * The number of records to display per page by default.
     * @default 10
     */
    page_size?: number;

    /**
     * The columns to display in the table.
     */
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

export interface TableParams {
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

    /**
     * The name of the sort parameter in the URL.
     * @default "sort"
     */
    sort?: string;
}

interface TablePaths {
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
}

export interface Column {
    header: Any;
    class?: string;
    on_click?: Any;
    content: Any;
    record: Record<string, Any>;
}

export interface PaginationProps {
    for: string;
    class?: string;
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

interface TableSort {
    /**
     * The default sorting to apply to the table.
     * @default "-id"
     */
    default?: string;
}
