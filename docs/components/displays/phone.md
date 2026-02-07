# phone

Renders a phone number as a clickable `tel:` link. Clicking initiates a phone call on mobile devices or opens a dialer on desktop.

## Basic Usage

```yaml
phone: ${contact.phone}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `content` | string | **Required.** Phone number (string or template) |
| `class` | string | Optional CSS classes |

## Examples

**Simple usage:**

```yaml
phone: ${contact.phone}
```

**In a table column with conditional display:**

```yaml
- header: Phone
  content:
    if record.phone:
      phone: ${record.phone}
```

## Related

- [Email](email.md) -- Clickable email link
- [Tables](../tables.md) -- Common usage context
