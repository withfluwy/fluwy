# wrap_into

Wraps the previous operation result into a new object under the specified key.

## Structure

```yaml
wrap_into: key_name
```

## Examples

**Wrap an API response:**

```yaml
button:
  on_click:
    get: https://api.example.com/contacts
    wrap_into: contacts_response
```

If the `get` returned `{ data: [...] }`, the result becomes `{ contacts_response: { data: [...] } }`.

**Wrap before passing to another operation:**

```yaml
button:
  on_click:
    get: https://api.example.com/user/123
    wrap_into: user
    log: "User data wrapped under 'user' key"
```

## Availability

Server and client.

## Related

- [extract](extract.md) -- Extract specific fields from a result
- [transform](transform.md) -- Rename keys in a result
- [vars](vars.md) -- Store data in context
