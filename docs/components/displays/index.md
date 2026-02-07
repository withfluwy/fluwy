# Display Components

Display components format and present data values such as dates, email addresses, and phone numbers. They handle common display patterns so you don't have to format data manually.

| Component | YAML Name | Purpose |
|-----------|-----------|---------|
| [Date](date.md) | `date` | Formatted date display |
| [Datetime](datetime.md) | `datetime` | Formatted date and time display |
| [Date From Now](date-from-now.md) | `date_from_now` | Relative time (e.g., "2 hours ago") |
| [Email](email.md) | `email` | Clickable mailto link |
| [Phone](phone.md) | `phone` | Clickable tel link |

## Usage in Tables

Display components are commonly used inside table column definitions:

```yaml
table:
  url: https://api.example.com/contacts
  columns:
    - header: Name
      content: ${record.first_name} ${record.last_name}
    - header: Email
      content:
        email: ${record.email}
    - header: Phone
      content:
        if record.phone:
          phone: ${record.phone}
    - header: Created
      content:
        date: ${record.date_created}
    - header: Last Updated
      content:
        if record.date_updated:
          date_from_now: ${record.date_updated}
```
