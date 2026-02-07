# refresh

Triggers a refresh on a specific component identified by its `id`. The target component re-fetches its data or re-renders.

## Structure

```yaml
refresh: component_id
```

## Examples

**Refresh a table after creating a record:**

```yaml
button:
  text: Add Contact
  on_click:
    post:
      url: /api/contacts
      data: form.data
    close_dialog:
    refresh: contacts_table
```

The table being refreshed must have a matching `id`:

```yaml
table:
  id: contacts_table
  url: https://api.example.com/contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}
```

**Refresh after deleting a record:**

```yaml
button:
  text: Delete
  color: destructive
  on_click:
    delete: /api/items/${item.id}
    refresh: items_table
    notify: "Item deleted"
```

This is particularly useful with tables, where you want to reload data after a create, update, or delete operation.

## Availability

Client-side only.

## Related

- [emit](emit.md) -- Cross-component event communication
- [goto](goto.md) -- Full page navigation
- [Tables](../components/tables.md) -- Table component documentation
