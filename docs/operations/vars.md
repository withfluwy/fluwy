# vars

Sets one or more variables in the context. Values can be literal strings or template expressions that reference other context values. Variables set with `vars` become available throughout the page using `${variable_name}` template syntax.

## Structure

```yaml
vars:
  variable_name: value_or_template
  another_variable: another_value
```

## Examples

**Setting a variable from an API response:**

```yaml
server:
  get: https://api.example.com/contacts/${params.id}
  vars:
    contact: response.data
---
h1: ${contact.first_name} ${contact.last_name}
```

**Setting multiple variables with templates:**

```yaml
vars:
  full_name: "${contact.first_name} ${contact.last_name}"
  is_active: ${contact.status}
  greeting: "Hello, ${contact.first_name}!"
```

**Using variables in page content:**

```yaml
h1: ${full_name}
p: ${greeting}
```

## Availability

Server and client.

## Related

- [load](load.md) -- Parallel data loading (also sets variables)
- [get](get.md) -- Fetch data to store in variables
- [Context](../concepts/context.md) -- How the context system works
