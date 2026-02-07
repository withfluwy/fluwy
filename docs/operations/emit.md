# emit

Emits a custom event that other components or operations can listen to. Useful for cross-component communication without direct references.

## Structure

```yaml
# Simple (event name only)
emit: event_name

# With payload data
emit:
  event: event_name
  payload: data_or_template
```

## Examples

**Emit a simple event:**

```yaml
button:
  text: Notify Others
  on_click:
    emit: data_updated
```

**Emit with payload:**

```yaml
button:
  text: Save and Notify
  on_click:
    post:
      url: /api/contacts
      data: form.data
    emit:
      event: contact_saved
      payload: ${response.data}
```

**Listen and react to events:**

Components can listen for emitted events using the `on_` prefix:

```yaml
table:
  id: contacts_table
  url: https://api.example.com/contacts
  on_contact_saved:
    refresh: contacts_table
```

## Availability

Client-side only.

## Related

- [refresh](refresh.md) -- Refresh a specific component
- [if](if.md) -- Conditional event handling
