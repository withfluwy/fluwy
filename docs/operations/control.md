# Control Operations

Control operations manage the flow of operation chains -- conditional execution, delays, event communication, component refresh, and authentication checks.

## Conditional Operations (if / else)

Fluwy uses the same `if` condition syntax in both templates and operation chains. Conditions are written as **YAML keys** using Fluwy's built-in expression language -- not JavaScript, and not `${}` template strings.

### Structure

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

### Condition Syntax

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

For full syntax reference, see [Conditions](../controls/conditions.md).

### Examples

```yaml
# Only allow admins to delete
button:
  text: Delete Item
  on_click:
    if user.role is "admin":
      delete: /api/items/${item.id}
      notify: "Item deleted"
    else:
      alert: "You don't have permission"
```

```yaml
# Conditional create/update
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

```yaml
# Multi-branch error handling
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

```yaml
# Truthiness check (is the value present and non-empty?)
button:
  on_click:
    if user:
      goto: /dashboard
    else:
      goto: /login
```

> **Important:** Conditions in Fluwy use plain context paths and Fluwy's own operators (`is`, `is not`, `and`, `or`, `in`). Do **not** use JavaScript operators (`===`, `!==`, `typeof`) or `${}` template syntax in conditions. Template strings (`${variable}`) are for inserting values into strings (like URLs or text), not for writing conditions.

**Availability:** Server and client.

---

## sleep

Pauses the operation chain for a specified number of milliseconds before continuing.

### Structure

```yaml
sleep: milliseconds
```

### Examples

```yaml
# Wait 1 second before showing notification
button:
  on_click:
    post:
      url: /api/contacts
      data: form.data
    sleep: 1000
    notify: "Contact saved!"
```

```yaml
# Simulate loading delay for testing
form:
  on_submit:
    sleep: 2000
    log: "Form submitted after delay"
```

This is commonly used to demonstrate loading states (e.g., button spinners) during development or to add intentional delays.

**Availability:** Server and client.

---

## emit

Emits a custom event that other components or operations can listen to. Useful for cross-component communication.

### Structure

**Simple (event name only):**

```yaml
emit: event_name
```

**With payload:**

```yaml
emit:
  event: event_name
  payload: data_or_template
```

### Examples

```yaml
# Emit a simple event
button:
  text: Notify Others
  on_click:
    emit: data_updated
```

```yaml
# Emit with payload data
button:
  text: Save and Notify
  on_click:
    post:
      url: /api/contacts
      data: form.data
    emit:
      event: contact_saved
      payload: ${response.data}
```

**Availability:** Client-side only.

---

## refresh

Triggers a refresh on a specific component identified by its `id`. The target component re-fetches its data or re-renders.

### Structure

```yaml
refresh: component_id
```

### Examples

```yaml
# Refresh a table after creating a new record
button:
  text: Add Contact
  on_click:
    post:
      url: /api/contacts
      data: form.data
    close_dialog:
    refresh: contacts_table
```

```yaml
# Table with an ID that can be refreshed
table:
  id: contacts_table
  url: https://api.example.com/contacts
  columns:
    - header: Name
      content: ${record.name}
```

This is particularly useful with tables, where you want to reload the data after a create, update, or delete operation.

**Availability:** Client-side only.

---

## authenticate

Checks if an authentication token exists in the context. If the token is missing, it throws an `UnauthenticatedError` which can trigger a redirect.

### Structure

**Simple (no redirect):**

```yaml
authenticate:
```

**With redirect:**

```yaml
authenticate:
  redirect: /login
```

### Examples

**Server-side page protection:**

```yaml
# In the page head:
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

When no `redirect` is specified and the user is not authenticated, the operation chain is interrupted with an error.

**Availability:** Server and client.
