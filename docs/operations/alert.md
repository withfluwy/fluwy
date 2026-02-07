# alert

Shows a browser `window.alert()` dialog with a message. Supports template strings for dynamic content.

## Structure

```yaml
alert: message_or_template
```

## Examples

**Simple alert:**

```yaml
button:
  text: Show Alert
  on_click:
    alert: "Hello, World!"
```

**Alert with context data:**

```yaml
button:
  text: Greet User
  on_click:
    alert: "Welcome, ${user.name}!"
```

**Alert after an operation:**

```yaml
button:
  text: Delete
  on_click:
    delete: /api/items/${item.id}
    alert: "Item has been deleted."
```

## Availability

Client-side only.

## Related

- [notify](notify.md) -- Toast notifications (non-blocking)
- [open-dialog](open-dialog.md) -- Custom modal dialogs
