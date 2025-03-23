# Loop Controls

The loop control system provides several ways to iterate over collections, ranges, or repeat actions a specific number of times. This document outlines all supported loop syntaxes and their use cases, as well as the structure of returned data.

## Loop Evaluation Structure

When loop expressions are evaluated, they return a Generator of `LoopItem` objects. Each `LoopItem` contains:

- `template`: The compiled template for that iteration
- `context`: The context data specific to that iteration

This well-defined structure ensures type safety and maintains a clear separation between the template and the context data.

Example of a `LoopItem` object:
```typescript
{
  template: { text: "User: Alice" }, // The compiled template
  context: { user: { name: "Alice", age: 25 }, index: 0 } // The iteration-specific context
}
```

## Loop Types

### Array Iteration

#### Basic Syntax

##### Array Iteration with "of"
Use `of` to iterate over array elements:
```yaml
# Using "for" with "of"
for item of items:
  text: "Item is ${item}"

# Using "each" with "of"
each item of items:
  text: "Item is ${item}"
```

##### Object Property Iteration with "in"
Use `in` to iterate over object properties (keys):
```yaml
# Using "for" with "in"
for key in person:
  text: "${key}: ${person[key]}"

# Using "each" with "in"
each prop in address:
  text: "${prop}: ${address[prop]}"
```

Note: The behavior differs between `of` and `in`:
- `of` is for arrays: the loop variable contains the array element
- `in` is for objects: the loop variable contains the property name (key)

#### Template Formats
Loops support three different template formats:

##### String Template
Simple text output with variable substitution:
```yaml
for user of users:
  text: User ${user.name} is ${user.age} years old
```

##### Object Template
Multiple fields with variable substitution:
```yaml
for user of users:
  h1: Welcome ${user.name}
  div: "Age: ${user.age}"
  mycomponent: "User ID: ${user.id}"
```

##### Array Template
Multiple items per iteration:
```yaml
for user of users:
  - h1: Welcome ${user.name}
  - div: "Age: ${user.age}"
  - mycomponent: "User ID: ${user.id}"
```

#### Variable Access
You can access object properties using either dot notation or bracket notation:
```yaml
# Dot notation
for user of users:
  text: User ${user.name} is ${user.age} years old

# Bracket notation
for user of users:
  text: User ${user['name']} from ${user['address']['city']}

# Dynamic property access
for user of users:
  text: Value is ${user[propertyName]}
```

#### Indexed Iteration
You can access the current index while iterating using the `with` keyword:
```yaml
# Using default "index" variable
for user of users with index:
  text: "${index}: ${user.name}"

# Using custom index variable
for user of users with i:
  text: "User at position ${i}: ${user.name}"

# Works with all iteration styles
each item in items with pos:
  text: "Position ${pos}: ${item}"
```

### Range Loops

#### Inclusive Range
Uses `..` syntax to include both start and end values:
```yaml
# Using numeric literals
for n of 1..5:
  text: Number ${n}

# Using context variables
for n of start..end:
  text: Number ${n}
```

#### Exclusive Range
Uses `...` syntax to exclude the end value:
```yaml
# Using numeric literals
for n of 1...6:
  text: Number ${n}  # Will print 1 through 5

# Using context variables
for n of start...end:
  text: Number ${n}
```

### Times Loops

#### Basic Repetition
```yaml
# Using numeric literals
3 times do:
  text: Repeated text

# Using context variables
count times do:
  text: Repeated ${count} times
```

#### Named Iterator
You can name the iteration variable using the `with` keyword:
```yaml
# Using numeric literals
3 times with n do:
  text: Iteration ${n}

# Using context variables
count times with i do:
  text: Count ${i}
```

## Loop Expression API

The loop control system provides two main methods:

### `check(expression: string): boolean`

Checks if the provided expression is a valid loop expression.

```typescript
// Examples:
loop_expression.check('for item of items'); // true
loop_expression.check('3 times do'); // true
loop_expression.check('for n of 1..5'); // true
loop_expression.check('invalid syntax'); // false
```

### `evaluate(loop: ForLoop, context: Context): Generator<LoopItem>`

Evaluates a loop expression and returns a generator that yields `LoopItem` objects.

```typescript
// Example:
const context = createContext({
  users: [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ]
});

const loopItems = loop_expression.evaluate(
  { 'for user of users': { text: 'User: ${user.name}' } },
  context
);

for (const item of loopItems) {
  console.log(item.template); // { text: 'User: Alice' }, { text: 'User: Bob' }
  console.log(item.context); // Contains user and other context data
}
```

## Template Resolution

### Variable Resolution
Variables in templates are resolved using the compile function, which supports:
- Dot notation: `${user.name}`
- Bracket notation: `${user['name']}`
- Dynamic properties: `${user[propertyName]}`
- Deep nesting: `${user.address.street}` or `${user['address']['street']}`

### Unresolved Variables
If a variable cannot be resolved, it will display the variable as is:
```yaml
for user of users:
  text: ${user.nonexistentProperty} # Will output "${user.nonexistentProperty}"
```

## Important Notes

1. Range values must be integers. Decimal numbers will cause an error.
2. For array iteration, the target must be a valid array in the context.
3. Index variables in array iteration start from 0.
4. The `with` keyword is used consistently across different loop types:
   - For array iteration: `for item of items with index`
   - For times loops: `5 times with n do`
5. Both `for` and `each` keywords are interchangeable and work with both `in` and `of` operators.
6. The `do` keyword is required only for times loops.
7. Range loops should use the `of` operator (not `in`).

## Examples with Context

```yaml
# Context:
# {
#   users: [
#     { name: 'Alice', age: 25 },
#     { name: 'Bob', age: 30 }
#   ],
#   count: 3,
#   start: 1,
#   end: 5
# }

# Array iteration with property access and index
for user of users with i:
  text: "${i}. ${user.name} (${user.age})"
# Output:
# 0. Alice (25)
# 1. Bob (30)

# Range loop with context variables
for n of start..end:
  text: "Value: ${n}"
# Output:
# Value: 1
# Value: 2
# Value: 3
# Value: 4
# Value: 5

# Times loop with named iterator
count times with i do:
  text: "Iteration #${i}"
# Output:
# Iteration #1
# Iteration #2
# Iteration #3
```

## Error Handling

The loop control system performs validation of expressions and will throw descriptive errors for invalid inputs:

1. Invalid syntax: `Invalid for loop syntax`
2. Non-integer range values: `Range values must be integers`
3. Missing iterables: `Iterable 'items' not found in context`
4. Invalid iterable types: `'person' is not an array` or `'items' is not an object`
5. Invalid times loops values: `Times loop requires an integer value`

These validation checks ensure that errors are caught early and provide clear feedback to developers.
```
