# notify

Shows a toast notification using the notification system (powered by [svelte-sonner](https://svelte-sonner.vercel.app/)). Supports different notification types: success, error, info, and warning.

## Structure

```yaml
# Simple success toast
notify: "Operation completed!"

# With specific type
notify:
  success: "Item saved successfully"
  # or
  error: "Something went wrong"
  # or
  info: "New update available"
  # or
  warning: "This action cannot be undone"
```

All message values support template strings (e.g., `"Saved ${contact.name}"`).

## Examples

**Success notification after saving:**

```yaml
button:
  text: Save
  on_click:
    post:
      url: /api/contacts
      data: form.data
    notify: "Contact saved!"
```

**Different types based on result:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        notify:
          error: "Failed to save contact"
    notify:
      success: "Contact created successfully"
```

**Warning notification:**

```yaml
button:
  text: Archive All
  on_click:
    notify:
      warning: "This will archive all items"
    post:
      url: /api/items/archive-all
```

## Availability

Client-side only.

## Related

- [alert](alert.md) -- Browser alert dialog (blocking)
- [open-dialog](open-dialog.md) -- Custom modal dialogs
