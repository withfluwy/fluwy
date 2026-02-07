# Display Components

Display components are used to format and present data values such as dates, email addresses, and phone numbers. They handle common display patterns so you don't have to format data manually.

## Date

Formats a date value using a configurable format string (powered by [dayjs](https://day.js.org/)).

```yaml
date: ${record.created_at}
```

### Properties

```yaml
date:
  content: # Required. Date value (string or template)
  format: # Optional. dayjs format string. Defaults to theme displays.date_format or 'll'
  class: # Optional CSS classes
```

### Format Examples

```yaml
# Default format (locale-aware short date, e.g., "Mar 10, 2024")
date: ${record.created_at}

# Custom format
date:
  content: ${record.created_at}
  format: "YYYY-MM-DD"

# Other common formats
date:
  content: ${event.date}
  format: "MMM D, YYYY"    # "Mar 10, 2024"
```

### Theme Setting

The default format can be configured in your theme file:

```yaml
displays:
  date_format: "ll"  # dayjs locale-aware format
```

---

## Date From Now

Displays a relative time string (e.g., "2 hours ago", "in 3 days") using dayjs relative time.

```yaml
date_from_now: ${record.updated_at}
```

### Properties

```yaml
date_from_now:
  content: # Required. Date value (string or template)
  class: # Optional CSS classes
```

### Examples

```yaml
# In a table column
- header: Updated At
  content:
    date_from_now: ${record.date_updated}

# Conditional display
if record.date_updated:
  date_from_now: ${record.date_updated}
```

---

## Datetime

Formats a datetime value including both date and time (powered by dayjs).

```yaml
datetime: ${event.start_time}
```

### Properties

```yaml
datetime:
  content: # Required. Datetime value (string or template)
  format: # Optional. dayjs format string. Defaults to theme displays.datetime_format or 'lll'
  class: # Optional CSS classes
```

### Examples

```yaml
# Default format (locale-aware, e.g., "Mar 10, 2024 12:00 PM")
datetime: ${event.start_time}

# Custom format
datetime:
  content: ${event.start_time}
  format: "YYYY-MM-DD HH:mm"
```

### Theme Setting

```yaml
displays:
  datetime_format: "lll"  # dayjs locale-aware format with time
```

---

## Email

Renders an email address as a clickable `mailto:` link.

```yaml
email: ${record.email}
```

### Properties

```yaml
email:
  content: # Required. Email address (string or template)
  class: # Optional CSS classes
```

### Examples

```yaml
# Simple usage
email: ${contact.email}

# In a table column
- header: Email
  content:
    email: ${record.email}
```

Clicking the rendered link opens the user's default email client.

---

## Phone

Renders a phone number as a clickable `tel:` link.

```yaml
phone: ${record.phone}
```

### Properties

```yaml
phone:
  content: # Required. Phone number (string or template)
  class: # Optional CSS classes
```

### Examples

```yaml
# Simple usage
phone: ${contact.phone}

# In a table column with conditional display
- header: Phone
  content:
    if record.phone:
      phone: ${record.phone}
```

Clicking the rendered link initiates a phone call on mobile devices or opens a dialer on desktop.

---

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
