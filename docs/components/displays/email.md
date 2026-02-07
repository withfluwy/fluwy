# email

Renders an email address as a clickable `mailto:` link. Clicking opens the user's default email client.

## Basic Usage

```yaml
email: ${contact.email}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `content` | string | **Required.** Email address (string or template) |
| `class` | string | Optional CSS classes |

## Examples

**Simple usage:**

```yaml
email: ${contact.email}
```

**In a table column:**

```yaml
- header: Email
  content:
    email: ${record.email}
```

**With conditional display:**

```yaml
if contact.email:
  email: ${contact.email}
```

## Related

- [Phone](phone.md) -- Clickable phone number link
- [Tables](../tables.md) -- Common usage context
