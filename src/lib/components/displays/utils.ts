import dayjs from 'dayjs';

export function formatDate(value: string, format: string): string {
    if (!value) return '';
    return dayjs(value).format(format);
}
