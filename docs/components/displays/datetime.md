# datetime

Formats a datetime value including both date and time (powered by [dayjs](https://day.js.org/)).

## Basic Usage

```yaml
datetime: ${event.start_time}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | string | -- | **Required.** Datetime value (string or template) |
| `format` | string | `'lll'` | Optional. dayjs format string. Defaults to theme `displays.datetime_format` or `'lll'` |
| `class` | string | -- | Optional CSS classes |

## Examples

**Default format (locale-aware, e.g., "Mar 10, 2024 12:00 PM"):**

```yaml
datetime: ${event.start_time}
```

**Custom format:**

```yaml
datetime:
  content: ${event.start_time}
  format: "YYYY-MM-DD HH:mm"
```

## Theming

The default format can be configured in your theme file:

```yaml
displays:
  datetime_format: "lll"  # dayjs locale-aware format with time
```

## Related

- [Date](date.md) -- Date without time
- [Date From Now](date-from-now.md) -- Relative time display
