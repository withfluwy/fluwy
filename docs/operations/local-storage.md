# Local Storage Operations

Local storage operations manage browser `localStorage` data, allowing you to remove persisted items.

## unset_local_storage

Removes an item from the browser's `localStorage` by key.

### Structure

```yaml
unset_local_storage: key_name
```

### Examples

```yaml
# Remove a stored preference
button:
  text: Clear Preferences
  on_click:
    unset_local_storage: user_preferences
    notify: "Preferences cleared"
```

```yaml
# Remove multiple items
button:
  text: Reset All
  on_click:
    - unset_local_storage: saved_filters
    - unset_local_storage: cached_data
    - notify: "All local data cleared"
```

**Availability:** Client-side only.

---

## remove_local_storage

An alias for `unset_local_storage`. Both operations behave identically.

```yaml
remove_local_storage: key_name
```

---

## Related

- [Cookies Operations](cookies.md) -- For managing HTTP cookies
- [Authentication Operations](auth.md) -- For managing auth tokens (stored as cookies)
