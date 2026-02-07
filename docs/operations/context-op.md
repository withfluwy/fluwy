# context (operation)

Retrieves a value from the context by its path and returns it as the operation result. This makes the retrieved value available to subsequent operations in the chain.

## Structure

```yaml
context: path.to.value
```

## Examples

**Retrieve a value from context:**

```yaml
button:
  on_click:
    context: user.id
    log: "Retrieved user ID"
```

**Use in an operation chain:**

```yaml
button:
  on_click:
    context: user.profile
    extract:
      name: first_name
      email: email
```

## Availability

Server and client.

## Related

- [vars](vars.md) -- Set context variables
- [extract](extract.md) -- Extract fields from operation results
- [Context](../concepts/context.md) -- How the context system works
