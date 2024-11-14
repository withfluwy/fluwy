import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import dayjs from 'dayjs';
import type { ColumnSchema } from './types.js';
import { get, titleToCamelCase } from '@/lib/core/utils/index.js';
import type { Any } from '@/lib/core/contracts.js';

dayjs.extend(localizedFormat);

export const TableSettings = {
    dateFormat: 'll', // Like: 'Mar 10, 2024';
    datetimeFormat: 'lll', // Like: 'Mar 10, 2024 12:00 PM';
};

export function formatDate(value: string, format: string): string {
    if (!value) return '';
    return dayjs(value).format(format);
}

export function getColumnValue(record: Any, column: ColumnSchema) {
    if (column.type === 'custom') return record;
    if (column.path) return get(record, column.path);
    if (typeof column.header === 'object') return record;

    return get(record, titleToCamelCase(column.header));
}
