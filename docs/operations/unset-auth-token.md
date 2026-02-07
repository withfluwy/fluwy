# unset_auth_token

Removes the authentication token from the context and deletes the corresponding cookie. Typically used for logging out users.

## Structure

```yaml
# Default token name ("auth_token")
unset_auth_token:

# Custom token name
unset_auth_token: example-token
```

## Examples

**Logout button:**

```yaml
button:
  text: Logout
  on_click:
    unset_auth_token:
    goto: /login
```

**Logout from a dropdown menu:**

```yaml
dropdown_item:
  text: Logout
  on_click:
    unset_auth_token:
    goto: /login
```

**Custom token name:**

If you used a custom token name when setting the token, use the same name when unsetting it:

```yaml
dropdown_item:
  text: Logout
  on_click:
    unset_auth_token: example-token
    goto: /login
```

## Availability

Server and client.

## Related

- [set-auth-token](set-auth-token.md) -- Set the auth token (login)
- [authenticate](authenticate.md) -- Check if a token exists
- [unset-cookie](unset-cookie.md) -- General cookie removal
