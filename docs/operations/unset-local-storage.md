# unset_local_storage

Removes an item from the browser's `localStorage` by key.

## Structure

```yaml
unset_local_storage: key_name
```

## Examples

**Remove a stored preference:**

```yaml
button:
  text: Clear Preferences
  on_click:
    unset_local_storage: user_preferences
    notify: "Preferences cleared"
```

**Remove multiple items:**

```yaml
button:
  text: Reset All
  on_click:
    - unset_local_storage: saved_filters
    - unset_local_storage: cached_data
    - notify: "All local data cleared"
```

## Availability

Client-side only.

## Related

- [remove-local-storage](remove-local-storage.md) -- Alias for unset_local_storage
- [unset-cookie](unset-cookie.md) -- Remove cookies
- [unset-auth-token](unset-auth-token.md) -- Remove auth tokens
