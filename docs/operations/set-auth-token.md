# set_auth_token

Sets the authentication token in the context and persists it as a cookie. Typically used after a successful login.

## Structure

```yaml
# Short syntax (uses default token name "auth_token")
set_auth_token: response.data.token

# Full syntax (custom token name)
set_auth_token:
  name: auth_token          # Optional. Defaults to "auth_token"
  path: response.data.token # Required. Context path to the token value
```

## Examples

**Login form with token storage:**

```yaml
container:
  class: max-w-md mx-auto my-12 text-center
  content:
    - h2: Login
    - form:
        on_submit:
          - post:
              url: /api/login
              data: form.data
              on_error:
                set_form_errors:
          - set_auth_token:
              name: example-token
              path: response.data.token
          - goto: /dashboard
        content:
          - input:
              label: Email
              field: email
              type: email
          - input:
              label: Password
              field: password
              type: password
          - button:
              text: Login
              type: submit
              color: primary
```

**Short syntax with default token name:**

```yaml
form:
  on_submit:
    post:
      url: /api/login
      data: form.data
    set_auth_token: response.data.token
    goto: /dashboard
```

With the cookie set, the token is automatically included in subsequent requests -- both in the browser and on the server.

## Availability

Server and client.

## Related

- [unset-auth-token](unset-auth-token.md) -- Remove the auth token (logout)
- [authenticate](authenticate.md) -- Check if a token exists
- [set-cookie](set-cookie.md) -- General cookie management
