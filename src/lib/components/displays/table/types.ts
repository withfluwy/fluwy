import type { Any } from '@/lib/core/contracts.js';

export interface Table {
    /**
     * The unique identifier for the table
     */
    id: string;

    /**
     * The property to track by.
     * @default "id"
     */
    track_by?: string;

    /**
     * The URL to fetch the data from
     */
    url?: string;

    /**
     * The data to display in the table.
     */
    data?: Any[];

    /**
     * The number of records to display per page by default.
     * @default 10
     */
    page_size?: number;

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
     * The credentials policy to use for the request. Can be one of:
     * - `omit`: The request will not include any cookies or authentication headers.
     * - `same-origin`: The request will include cookies and authentication headers if the URL is on the same origin as the calling script.
     * - `include`: The request will include cookies and authentication headers.
     * @default "omit"
     */
    credentials?: 'omit' | 'same-origin' | 'include';

    /**
     * The list of operations to perform when a row is clicked.
     */
    on_row_click?: Any;

    /**
     * The columns to display in the table.
     */
    columns: Column[];
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
     *  "results": [...],
     *  ...
     * }
     * ```
     * then the returned data would be in the "results" key. And you would set this to "results".
     * @default "data"
     */
    data?: string;

    /**
     * The path to the count in the response from the root. For example if your endpoint return a json body like
     * ```json
     * {
     *  "total": 8420349
     *  ...
     * }
     * ```
     * then the count would be in "count".
     * @default "total"
     */
    total?: string;
}

export interface Column {
    /**
     * The header of the column. Can be a string or a template.
     */
    header: Any;
    /**
     * Optional class to apply to the cells.
     */
    class?: string;
    /**
     * The operations to perform when the cell is clicked.
     */
    on_click?: Any;
    /**
     * The content to display in the column. Can be a string or a template.
     */
    content: Any;
}

export interface PaginationProps {
    for: string;
    class?: string;
}

export interface PaginationPayload {
    /**
     * The current page number.
     */
    page: number;
    /**
     * The number of records per page.
     */
    pageSize: number;
    /**
     * The total number of records on all pages.
     */
    total: number;
    /**
     * The number of records in the current page.
     */
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
