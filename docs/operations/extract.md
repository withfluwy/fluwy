# extract

Extracts specific fields from the previous operation result using a mapping. Creates a new object with only the specified fields, optionally renaming them.

## Structure

```yaml
extract:
  new_key: source.path.to.value
  another_key: another.source.path
```

The `extract` operation flattens the previous result into dot-notation keys, picks the ones you specify, and builds a new object.

## Examples

**Extract fields from an API response:**

```yaml
button:
  on_click:
    get: https://api.example.com/user/123
    extract:
      firstName: data.profile.firstName
      lastName: data.profile.lastName
      email: data.contact.email
    log: "Extracted: ${firstName} ${lastName}"
```

**Simplify a complex response:**

```yaml
form:
  on_submit:
    get: https://api.example.com/user/${form.data.id}
    extract:
      name: data.profile.display_name
      avatar: data.profile.avatar_url
    vars:
      user_summary: response.data
```

## Availability

Server and client.

## Related

- [transform](transform.md) -- Rename keys in a result
- [wrap-into](wrap-into.md) -- Wrap a result under a new key
- [vars](vars.md) -- Store extracted data in context
