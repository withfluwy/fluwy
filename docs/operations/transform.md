# transform

Renames keys in the previous operation result. Useful when your API returns keys in one format but you need them in another.

## Structure

```yaml
transform:
  old_key: new_key
  another_old_key: another_new_key
```

## Examples

**Rename API response keys:**

```yaml
button:
  on_click:
    get: https://api.example.com/user/123
    transform:
      firstName: first_name
      lastName: last_name
      emailAddress: email
```

This transforms `{ firstName: "John", lastName: "Doe" }` into `{ first_name: "John", last_name: "Doe" }`.

**Normalize data before saving:**

```yaml
form:
  on_submit:
    transform:
      fullName: name
      phoneNumber: phone
    post:
      url: /api/contacts
      data: form.data
```

## Availability

Server and client.

## Related

- [extract](extract.md) -- Extract specific fields from a result
- [wrap-into](wrap-into.md) -- Wrap a result under a new key
