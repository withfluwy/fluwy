# authenticate

Checks if an authentication token exists in the context. If the token is missing, it throws an `UnauthenticatedError` which can trigger a redirect to a login page.

## Structure

```yaml
# Simple (no redirect -- throws error if unauthenticated)
authenticate:

# With redirect
authenticate:
  redirect: /login
```

## Examples

**Server-side page protection:**

Place `authenticate` in the page head to protect the entire page. Unauthenticated users are redirected before any data is loaded:

```yaml
server:
  authenticate:
    redirect: /login
  load:
    profile: https://api.example.com/me
---
h1: Welcome, ${profile.name}
```

**Client-side guard before an action:**

```yaml
button:
  text: Access Dashboard
  on_click:
    authenticate:
      redirect: /login
    goto: /dashboard
```

**Without redirect:**

When no `redirect` is specified and the user is not authenticated, the operation chain is interrupted with an error.

```yaml
server:
  authenticate:
  load:
    data: https://api.example.com/protected-resource
```

## Availability

Server and client.

## Related

- [set-auth-token](set-auth-token.md) -- Set the auth token (login)
- [unset-auth-token](unset-auth-token.md) -- Remove the auth token (logout)
- [goto](goto.md) -- Manual navigation and redirects
