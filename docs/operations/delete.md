# delete

Performs an HTTP DELETE request to remove a resource at the given URL.

## Structure

```yaml
delete: url_template
```

The URL template is compiled with context data. All `${...}` placeholders must resolve to actual values, otherwise the operation will fail.

## Examples

**Delete a resource by ID:**

```yaml
button:
  text: Delete Contact
  color: destructive
  on_click:
    delete: /api/contacts/${params.id}
    notify: "Contact deleted"
    goto: /contacts
```

**Delete with confirmation dialog:**

```yaml
button:
  text: Delete
  color: destructive
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

## Availability

Server and client.

## Related

- [get](get.md) -- Read resources
- [post](post.md) -- Create resources
- [put](put.md) -- Update resources
- [open-dialog](open-dialog.md) -- Confirmation dialogs
- [refresh](refresh.md) -- Refresh a component after deletion
