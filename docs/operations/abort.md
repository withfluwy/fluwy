# abort

Stops the current operation chain immediately. No subsequent operations in the chain will execute. This is useful for guard clauses and validation checks in custom operations.

## Structure

In YAML:

```yaml
abort:
```

In custom TypeScript operations:

```typescript
import { abort } from '@fluwy/ui';

export const my_operation: Operation = (params, { context }) => {
  if (!context.current_user) {
    abort('You must be logged in to perform this operation.');
  }
};
```

## Examples

**Guard clause in a custom operation:**

```typescript
import { abort } from '@fluwy/ui';

export const require_admin: Operation = (params, { context }) => {
  if (context.user?.role !== 'admin') {
    abort('Admin access required.');
  }
};
```

**Using in a YAML operation chain:**

```yaml
button:
  text: Dangerous Action
  on_click:
    if not user.is_admin:
      alert: "You don't have permission"
      abort:
    delete: /api/dangerous-resource
```

## Availability

Server and client.

## Related

- [if](if.md) -- Conditional execution (preferred for simple checks)
- [authenticate](authenticate.md) -- Built-in auth guard
- [Operations Overview](index.md) -- How to create custom operations
