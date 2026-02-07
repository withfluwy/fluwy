# Conditions

Fluwy provides powerful conditional statements that enable dynamic content rendering based on various conditions. Using `if` and `else` statements, you can control visibility and behavior in your application.

## Basic Usage

The basic syntax for conditional statements in Fluwy follows this structure:

```yaml
- if condition:
    content_if_true
  else:
    content_if_false
```

### Use in Templates

You can use `if` and `else` statements in your templates to dynamically render content based on conditions:

```yaml
- if user:
    p: Welcome back!
  else:
    button:
      text: Login
      on_click:
        goto: /login
```

### Use in Operations

You can use `if` and `else` statements in your operations to dynamically perform actions based on conditions:

```yaml
form:
  on_submit:
    post:
      ...
      on_error:
        if response.status >= 200 and response.status < 300:
          notify: User created successfully!
        else if response.status is 401:
          goto: /login
        else if response.status is 404:
          goto: /404
        else:
          notify: An error occurred
          log: response.data
```

Common create/update pattern:

```yaml
form:
  on_submit:
    if form.data.id:
      put:
        ...
    else:
      post:
        ...
```

## Comparison Operators

Fluwy supports various comparison operators for conditions:

| Operator | Description |
|----------|-------------|
| `is` or `==` | Equal to |
| `is not` or `!=` | Not equal to |
| `>` | Greater than |
| `>=` | Greater than or equal to |
| `<` | Less than |
| `<=` | Less than or equal to |

Example:

```yaml
- if age >= 18:
    p: Adult
- if score > 80:
    p: Excellent performance!
```

## Logical Operators

You can combine multiple conditions using logical operators:

| Operator | Description |
|----------|-------------|
| `and` or `&&` | Both conditions must be true |
| `or` or `\|\|` | At least one condition must be true |
| `not` | Negates a condition |

Example:

```yaml
- if user.role is "admin" and user.active:
    p: Active admin user
- if age < 13 or age > 65:
    p: Special price applies
- if not user.is_banned:
    p: Welcome!
```

## Working with Arrays

You can check if an item exists in an array using the `in` operator:

```yaml
- if "admin" in user.roles:
    p: Admin access granted
- if 3 in allowed_numbers:
    p: Number is allowed
```

## Complex Conditions

You can use parentheses to group conditions and create more complex logic:

```yaml
- if (age > 18 and has_license) or (age > 21):
    p: Can rent a car
- if not (status < 200 or status >= 300):
    p: Successful response
```

## Type-Specific Comparisons

Fluwy automatically handles different data types:

- **Strings**: Use quotes for string values. Ex.: `if name is "John":`
- **Numbers**: Use without quotes. Ex.: `if age is 25:`
- **Booleans**: Use true/false. Ex.: `if is_active is true:` or simply `if is_active:`
- **Null/Undefined**: Use `is null`, `is undefined`, or `is nil` (checks both). Ex.: `if data is null:`

Example:

```yaml
- if name is "John":
    p: Hello John!
- if age is 25:
    p: Quarter century!
- if is_active is true:
    p: Account is active
- if data is null:
    p: No data available
```

## Property Existence

Check if a property exists using the `in` operator:

```yaml
- if "email" in user:
    p: Email is set
- if "error" in response:
    p: Error occurred
```

## Important: Conditions vs Template Strings

Conditions and template strings (`${}`) serve different purposes and use different syntax:

- **Conditions** (`if ... :`) reference context paths directly: `if user.role is "admin":`
- **Template strings** (`${}`) are for inserting values into content strings: `h1: Hello, ${user.name}!`

Do **not** use `${}` inside conditions. Do **not** use JavaScript operators (`===`, `!==`, `typeof`, ternary `?:`) in conditions -- use Fluwy's own operators (`is`, `is not`, `and`, `or`, `in`, `not`).

```yaml
# Correct
- if user.role is "admin":
    p: Welcome, ${user.name}!

# Wrong - do not mix ${}` with conditions
- if ${user.role} === "admin":     # <-- incorrect
```

## Best Practices

- Use meaningful condition names that clearly express their purpose
- Keep conditions simple and readable
- Use parentheses to make complex conditions clear
- Consider breaking very complex conditions into multiple steps

## Common Examples

### User Authentication

```yaml
- if user:
    button:
      text: Logout
      on_click: logout
  else:
    button:
      text: Login
      on_click: login
```

### API Response Handling

```yaml
- if response.status is 200 and response.data:
    debug: response.data
  else if response.status is 404:
    p: No data found
  else:
    p: An error occurred
```

### Permissions Check

```yaml
- if "update" in permissions.users:
    button:
      text: Edit
```

## Related

- [`if` (operation)](../operations/if.md) -- Conditional execution in operation chains (different from template conditions)
- [Loops](loops.md) -- Iteration with `for-of`, `for-in`, ranges, and `times`
- [Context](../concepts/context.md) -- Data available for conditions
