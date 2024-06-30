import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import type { ColumnSchema } from './types';
import { get, titleToCamelCase } from '../core/utils';
import type { Any } from '../core/contracts';

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

	return get(record, titleToCamelCase(column.header));
}
