# unset_cookie

Removes a cookie from the browser by name.

## Structure

```yaml
unset_cookie: cookie_name
```

## Examples

**Remove a cookie on button click:**

```yaml
button:
  text: Clear Session
  on_click:
    unset_cookie: session_id
    notify: "Session cleared"
```

**Remove a cookie during logout:**

```yaml
dropdown_item:
  text: Logout
  on_click:
    unset_cookie: custom_session
    unset_auth_token:
    goto: /login
```

## Availability

Server and client.

## Related

- [set-cookie](set-cookie.md) -- Set cookies
- [remove-cookie](remove-cookie.md) -- Alias for unset_cookie
- [unset-auth-token](unset-auth-token.md) -- Remove auth token cookie
