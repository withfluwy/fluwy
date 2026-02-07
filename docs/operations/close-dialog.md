# close_dialog

Closes the currently open dialog. Typically used inside dialog footer buttons after completing an action.

## Structure

```yaml
close_dialog:
```

## Examples

**Cancel button in a dialog:**

```yaml
button:
  text: Cancel
  variant: ghost
  on_click:
    close_dialog:
```

**Close after a successful action:**

```yaml
button:
  text: Save
  color: primary
  on_click:
    post:
      url: /api/contacts
      data: form.data
    close_dialog:
    refresh: contacts_table
    notify: "Contact saved!"
```

See [Dialogs](../components/dialogs.md) for full examples of dialog workflows.

## Availability

Client-side only.

## Related

- [open-dialog](open-dialog.md) -- Open a modal dialog
- [Dialogs](../components/dialogs.md) -- Dialog component documentation
