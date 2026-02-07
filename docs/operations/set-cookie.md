# set_cookie

Sets one or more cookies in the browser. Useful for persisting user preferences, session data, or any key-value pairs across pages.

## Structure

```yaml
# Simple key-value pairs
set_cookie:
  cookie_name: cookie_value
  another_cookie: another_value

# With duration or expiration
set_cookie:
  cookie_name:
    value: cookie_value       # Required
    duration: 3600            # Optional. Duration in seconds
    expires_at: 2025-01-01    # Optional. ISO 8601 datetime or unix timestamp
```

> **Note:** If you don't specify `duration` or `expires_at`, the cookie will never expire. Never set both at the same time -- the behavior is undefined.

## Examples

**Set simple cookies:**

```yaml
button:
  text: Save Preferences
  on_click:
    set_cookie:
      theme: dark
      language: en
    notify: "Preferences saved"
```

**Set cookies with expiration:**

```yaml
set_cookie:
  session_id:
    value: value-1
    duration: 3600  # expires in 1 hour
  remember_me:
    value: true
    expires_at: 2025-12-31
```

**Set cookies from API response:**

```yaml
button:
  on_click:
    post:
      url: /api/login
      data: form.data
    set_cookie:
      session:
        value: response.data.session_id
        duration: response.data.session_duration
```

## Availability

Server and client.

## Related

- [unset-cookie](unset-cookie.md) -- Remove a cookie
- [set-auth-token](set-auth-token.md) -- Auth-specific cookie management
- [unset-local-storage](unset-local-storage.md) -- Browser localStorage management
