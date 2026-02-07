# if / else

Conditionally executes operations based on context values. Fluwy uses its own expression language for conditions -- not JavaScript, and not `${}` template strings.

## Structure

```yaml
# Simple truthiness check
if context_path:
  operation: ...

# With comparison
if context_path operator value:
  operation: ...
else:
  operation: ...

# With else if
if condition_a:
  operation_a: ...
else if condition_b:
  operation_b: ...
else:
  fallback_operation: ...
```

## Condition Syntax

Conditions reference context values directly by their path (without `${}`). The following operators are supported:

| Operator | Example |
|----------|---------|
| `is` or `==` | `if user.role is "admin":` |
| `is not` or `!=` | `if status is not 200:` |
| `>`, `>=`, `<`, `<=` | `if age >= 18:` |
| `and` or `&&` | `if user.active and user.verified:` |
| `or` or `\|\|` | `if role is "admin" or role is "editor":` |
| `not` | `if not user.is_banned:` |
| `in` | `if "admin" in user.roles:` |

String values must be quoted (`"value"` or `'value'`). Numbers are unquoted. Boolean checks can be a single path (`if user:` checks truthiness).

## Examples

**Only allow admins to delete:**

```yaml
button:
  text: Delete Item
  on_click:
    if user.role is "admin":
      delete: /api/items/${item.id}
      notify: "Item deleted"
    else:
      alert: "You don't have permission"
```

**Conditional create or update:**

```yaml
form:
  on_submit:
    if form.data.id:
      put:
        url: /api/contacts/${form.data.id}
        data: form.data
    else:
      post:
        url: /api/contacts
        data: form.data
```

**Multi-branch error handling:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        if response.status is 401:
          goto: /login
        else if response.status is 404:
          notify:
            error: "Resource not found"
        else:
          notify:
            error: "An error occurred"
          log: response.data
```

**Simple truthiness check:**

```yaml
button:
  on_click:
    if user:
      goto: /dashboard
    else:
      goto: /login
```

> **Important:** Conditions in Fluwy use plain context paths and Fluwy's own operators (`is`, `is not`, `and`, `or`, `in`). Do **not** use JavaScript operators (`===`, `!==`, `typeof`) or `${}` template syntax in conditions. Template strings (`${variable}`) are for inserting values into strings (like URLs or text), not for writing conditions.

For conditional rendering in templates (showing/hiding components), see [Conditions](../controls/conditions.md).

## Availability

Server and client.

## Related

- [Conditions (template)](../controls/conditions.md) -- Conditional rendering in templates
- [abort](abort.md) -- Stop an operation chain
- [sleep](sleep.md) -- Delay in operation chains
