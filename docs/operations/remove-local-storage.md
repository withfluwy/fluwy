# remove_local_storage

An alias for [`unset_local_storage`](unset-local-storage.md). Both operations behave identically -- use whichever reads better in your YAML.

## Structure

```yaml
remove_local_storage: key_name
```

## Example

```yaml
button:
  text: Clear Cache
  on_click:
    remove_local_storage: cached_data
    notify: "Cache cleared"
```

## Availability

Client-side only.

## Related

- [unset-local-storage](unset-local-storage.md) -- Same operation (primary name)
- [unset-cookie](unset-cookie.md) -- Remove cookies
