# Auth Operations

Authentication and authorization operations are present in basically all web applications. This page groups all Fluwy's operations that are used for authentication and authorization.

## set_auth_token

The `set_auth_token` operation is used to set the authentication token in the context. The strategy used to persist this token is via cookies. Inside a form component you can add this operation after successfully logging in a user.

### Login Form Example

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
                payloadcms.set_form_errors:
          - set_auth_token:
              name: example-token
              path: response.data.token
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

### Properties

```yaml
set_auth_token:
  name: auth_token          # Optional. Defaults to 'auth_token'
  path: response.data.token # Required. Context path to the token value
```

### Short Syntax

If you want to use the default token name `auth_token` you can just pass a string parameter instead of the object:

```yaml
set_auth_token: response.data.token
```

Now the operation will set the `auth_token` cookie with the value from the context path `response.data.token`. With the cookie set, you can now use the token in requests both in the browser and on the server through the key you specified.

## unset_auth_token

The `unset_auth_token` operation is used to remove the authentication token from the context. The strategy used to persist this token is via cookies so it also removes the cookie. This is usually used for logging out users.

### Example

```yaml
dropdown_item:
  text: Logout
  on_click:
    unset_auth_token:
    goto: /login
```

### Custom Token Name

If you want to customize the name of the cookie used for the authentication token:

```yaml
unset_auth_token: example-token
```
