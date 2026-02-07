# log

Logs a message to the browser console (client-side) or server console (server-side). Useful for debugging operation chains during development.

## Structure

```yaml
log: message_or_template
```

## Examples

**Simple message:**

```yaml
log: "Button was clicked"
```

**With context data:**

```yaml
log: "User ${user.name} submitted form"
```

**Debugging a response:**

```yaml
button:
  text: Submit
  on_click:
    post:
      url: /api/contacts
      data: form.data
    log: "Response status: ${response.status}"
    log: "Response data: ${response.data}"
```

## Availability

Server and client.

## Related

- [Debug](../components/debug.md) -- Visual debug component for inspecting context
- [vars](vars.md) -- Set variables for inspection
