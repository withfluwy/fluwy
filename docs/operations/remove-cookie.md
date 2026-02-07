# remove_cookie

An alias for [`unset_cookie`](unset-cookie.md). Both operations behave identically -- use whichever reads better in your YAML.

## Structure

```yaml
remove_cookie: cookie_name
```

## Example

```yaml
button:
  text: Clear Preferences
  on_click:
    remove_cookie: user_preferences
    notify: "Preferences cleared"
```

## Availability

Server and client.

## Related

- [unset-cookie](unset-cookie.md) -- Same operation (primary name)
- [set-cookie](set-cookie.md) -- Set cookies
