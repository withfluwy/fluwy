# date

Formats a date value using a configurable format string (powered by [dayjs](https://day.js.org/)).

## Basic Usage

```yaml
date: ${record.created_at}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | string | -- | **Required.** Date value (string or template) |
| `format` | string | `'ll'` | Optional. dayjs format string. Defaults to theme `displays.date_format` or `'ll'` |
| `class` | string | -- | Optional CSS classes |

## Examples

**Default format (locale-aware short date, e.g., "Mar 10, 2024"):**

```yaml
date: ${record.created_at}
```

**Custom format:**

```yaml
date:
  content: ${record.created_at}
  format: "YYYY-MM-DD"
```

**Other common formats:**

```yaml
date:
  content: ${event.date}
  format: "MMM D, YYYY"    # "Mar 10, 2024"
```

## Theming

The default format can be configured in your theme file:

```yaml
displays:
  date_format: "ll"  # dayjs locale-aware format
```

## Related

- [Datetime](datetime.md) -- Date with time
- [Date From Now](date-from-now.md) -- Relative time display
- [Tables](../tables.md) -- Common parent component
