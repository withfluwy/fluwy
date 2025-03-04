# Loop Controls

The loop control system provides several ways to iterate over collections, ranges, or repeat actions a specific number of times. This document outlines all supported loop syntaxes and their use cases.

## Array Iteration

### Basic Syntax

#### Array Iteration with "of"
Use `of` to iterate over array elements:
```yaml
# Using "for" with "of"
for item of items:
  text: "Item is ${item}"

# Using "each" with "of"
each item of items:
  text: "Item is ${item}"
```

#### Object Property Iteration with "in"
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

### Template Formats
Loops support three different template formats:

#### String Template
Simple text output with variable substitution:
```yaml
for user of users:
  text: User ${user.name} is ${user.age} years old
```

#### Object Template
Multiple fields with variable substitution:
```yaml
for user of users:
  h1: Welcome ${user.name}
  div: "Age: ${user.age}"
  mycomponent: "User ID: ${user.id}"
```

#### Array Template
Multiple items per iteration:
```yaml
for user of users:
  - h1: Welcome ${user.name}
  - div: "Age: ${user.age}"
  - mycomponent: "User ID: ${user.id}"
```

### Variable Access
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

### Indexed Iteration
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

## Range Loops

### Inclusive Range
Uses `..` syntax to include both start and end values:
```yaml
# Using numeric literals
for n in 1..5:
  text: Number ${n}

# Using context variables
for n in start..end:
  text: Number ${n}
```

### Exclusive Range
Uses `...` syntax to exclude the end value:
```yaml
# Using numeric literals
for n in 1...6:
  text: Number ${n}  # Will print 1 through 5

# Using context variables
for n in start...end:
  text: Number ${n}
```

## Times Loops

### Basic Repetition
```yaml
# Using numeric literals
3 times do:
  text: Repeated text

# Using context variables
count times do:
  text: Repeated ${count} times
```

### Named Iterator
You can name the iteration variable using the `with` keyword:
```yaml
# Using numeric literals
3 times with n do:
  text: Iteration ${n}

# Using context variables
count times with i do:
  text: Count ${i}
```

## Template Resolution

### Variable Resolution
Variables in templates are resolved using the compile function, which supports:
- Dot notation: `${user.name}`
- Bracket notation: `${user['name']}`
- Dynamic properties: `${user[propertyName]}`
- Deep nesting: `${user.address.street}` or `${user['address']['street']}`

### Unresolved Variables
If a variable cannot be resolved, it will be replaced with an empty string:
```yaml
for user of users:
  text: ${user.nonexistentProperty} # Will output an empty string
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
for n in start..end:
  text: "Value: ${n}"
# Output:
# Value: 1
# Value: 2
# Value: 3
# Value: 4
# Value: 5

# Times loop with iterator
count times with i do:
  text: "Count: ${i}"
# Output:
# Count: 0
# Count: 1
# Count: 2
```
