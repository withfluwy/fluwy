# open_dialog

Opens a modal dialog with the specified content. The dialog definition is passed as a YAML object with title, description, body content, and optional footer actions.

## Structure

```yaml
open_dialog:
  dialog:
    title: string         # Dialog title
    description: string   # Optional. Dialog description
    icon: string          # Optional. Icon from icones.js.org
    color: string         # Optional. Color variant
    content: Components   # Optional. Dialog body content
    footer: Components    # Optional. Dialog footer content
    on_open: Operations   # Optional. Operations to run when dialog opens
```

## Examples

**Confirmation dialog:**

```yaml
button:
  text: Confirm Delete
  on_click:
    open_dialog:
      dialog:
        title: Are you sure?
        description: This action cannot be undone.
        footer:
          - button:
              text: Cancel
              variant: ghost
              on_click: close_dialog
          - button:
              text: Delete
              color: destructive
              on_click:
                delete: /api/items/${item.id}
                close_dialog:
                refresh: items_table
```

**Form dialog:**

```yaml
button:
  text: New Contact
  color: primary
  on_click:
    open_dialog:
      dialog:
        title: Create Contact
        content:
          form:
            on_submit:
              post:
                url: /api/contacts
                data: form.data
              close_dialog:
              refresh: contacts_table
            content:
              - input:
                  field: name
                  label: Name
              - input:
                  field: email
                  label: Email
              - button:
                  text: Create
                  type: submit
                  color: primary
```

For full dialog documentation, see [Dialogs](../components/dialogs.md).

## Availability

Client-side only.

## Related

- [close-dialog](close-dialog.md) -- Close the currently open dialog
- [Dialogs](../components/dialogs.md) -- Dialog component documentation
- [alert](alert.md) -- Simple browser alert
