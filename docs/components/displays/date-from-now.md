# date_from_now

Displays a relative time string (e.g., "2 hours ago", "in 3 days") using dayjs relative time.

## Basic Usage

```yaml
date_from_now: ${record.updated_at}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `content` | string | **Required.** Date value (string or template) |
| `class` | string | Optional CSS classes |

## Examples

**In a table column:**

```yaml
- header: Updated At
  content:
    date_from_now: ${record.date_updated}
```

**With conditional display:**

```yaml
if record.date_updated:
  date_from_now: ${record.date_updated}
```

**Standalone usage:**

```yaml
p: "Last login:"
date_from_now: ${user.last_login}
```

## Related

- [Date](date.md) -- Formatted absolute date
- [Datetime](datetime.md) -- Date with time
- [Tables](../tables.md) -- Common usage context
