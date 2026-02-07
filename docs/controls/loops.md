# Loops

Loops are powerful controls that let you create dynamic, repeating content with minimal code. They're essential for working with collections of data and building flexible user interfaces.

## What Loops Do

Loops solve a fundamental problem in UI development: **repetition**. Instead of manually duplicating the same code for each item, loops let you define the pattern once and apply it to multiple data points.

### Without Loops

```yaml
column:
  content:
    - div:
        class: card
        content: Alice
    - div:
        class: card
        content: Bob
    - div:
        class: card
        content: Charlie
```

### With Loops

```yaml
# context:
#   users: ["Alice", "Bob", "Charlie"]
column:
  for user of users:
    div:
      class: card
      content: ${user}
```

As you can see, loops make your code more concise, maintainable, and adaptable. When your data changes (users are added or removed), your UI automatically updates without requiring manual code changes.

## Common Loop Patterns

### Displaying Lists of Items

The most common loop pattern is displaying a list of items from an array. This is perfect for showing team members, products, notifications, or any collection of similar items.

```yaml
for user of users:
  text: "User: ${user.name}"
```

Example with more complex content:

```yaml
# context:
#   team:
#     - name: "Alice Mitchell"
#       role: "Software Developer"
#     - name: "Bob Taylor"
#       role: "UX Designer"
#     - name: "Charlie Johnson"
#       role: "Project Manager"

row:
  for member of team:
    div:
      class: p-3 bg-blue-50 dark:bg-blue-900/20 rounded
      content:
        - div:
            class: font-medium
            text: ${member.name}
        - div:
            class: text-sm text-gray-600 dark:text-gray-400
            text: ${member.role}
```

### Working with Indices

You can access the current item's index using the `with index` syntax:

```yaml
for user of users with index:
  text: "${index}. ${user.name}"

# With custom index variable name
for user of users with i:
  text: "Position ${i}: ${user.name}"
```

This is useful for numbered lists, tracking positions, or applying different styles to odd/even items.

## Loop Syntax Variations

Fluwy supports several loop syntax variations to handle different data types and use cases.

### For-of Loops (Arrays)

The `for-of` syntax is used to iterate over arrays. This is the most common loop type you'll use.

```yaml
# Basic syntax
for user of users:
  text: "Name: ${user.name}, Age: ${user.age}"

# With index
for user of users with index:
  text: "${index + 1}. ${user.name}"
```

You can also use the alternative `each` keyword which works the same way:

```yaml
each user of users:
  text: "Name: ${user.name}, Age: ${user.age}"
```

### For-in Loops (Object Properties)

The `for-in` syntax is used to iterate over object properties (keys). This is useful for displaying settings, configurations, or any key-value data.

```yaml
# context:
#   settings:
#     theme: "dark"
#     notifications: true
#     language: "en"

for key in settings:
  text: "${key}: ${settings[key]}"
```

This creates entries like "theme: dark", "notifications: true", etc.

## Range and Times Loops

For numeric sequences and repetition, Fluwy provides specialized loop types.

### Range Loops

Range loops let you iterate over a sequence of numbers. There are two types:

**Inclusive Range** (includes both start and end values):

```yaml
# Loop from 1 to 5 (includes 5)
for n of 1..5:
  div: "Number ${n}"
```

**Exclusive Range** (excludes the end value):

```yaml
# Loop from 1 to 5 (excludes 6)
for n of 1...6:
  div: "Number ${n}"
```

You can also use variables for dynamic ranges:

```yaml
# context:
#   start: 1
#   end: 5
for n of start..end:
  div: "Number ${n}"
```

### Times Loops

Times loops let you repeat content a specific number of times:

```yaml
# Repeat 3 times
3 times do:
  div: "Repeated element"

# With index variable
3 times with number do:
  div: "Item #${number}"
```

You can also use variables for dynamic repetition:

```yaml
# context:
#   count: 3
count times do:
  div: "Dynamic repetition"
```

## Advanced Loop Techniques

### Nested Loops

You can nest loops to create complex structures like grids, tables, or multi-dimensional data:

```yaml
column:
  class: space-y-2
  for row of 1..3:
    div:
      class: flex space-x-2
      content:
        for col of 1..4:
          div:
            class: w-10 h-10 bg-blue-100 flex items-center justify-center
            text: "${row},${col}"
```

### Combining Loops with Conditions

You can use conditions inside loops to filter items or apply different styles:

```yaml
# Only show active users
for user of users:
  if user.active:
    div:
      class: "user-card active"
      text: ${user.name}

# Apply different styles based on index
for item of items with i:
  div:
    class: ${i % 2 === 0 ? "even-row" : "odd-row"}
    text: ${item.name}
```

### Loop Variables and Scope

Variables created in loops are only available within that loop's scope. You can reference outer variables, but loop variables won't be accessible outside the loop.

```yaml
# context:
#   total: 0
#   items:
#     - price: 10
#     - price: 20

# This works - accessing outer variable
for item of items:
  text: "Item price: ${item.price}, Total: ${total}"

# Variables created in loops stay in scope
for item of items with i:
  div: "Position ${i}: ${item.price}"
```

## Practical Examples

### Dynamic Navigation Menu

```yaml
# context:
#   menu_items:
#     - "Home"
#     - "Products"
#     - "Services"
#     - "About"
#     - "Contact"

div:
  class: bg-blue-600 text-white p-4
  content:
    div:
      class: flex space-x-6
      for item of menu_items:
        div:
          class: font-medium
          text: ${item}
```

### Product Grid

```yaml
# context:
#   products:
#     - name: "Laptop Pro"
#       price: 1299
#       description: "High-performance laptop for professionals"
#     - name: "Smartphone X"
#       price: 799
#       description: "Latest smartphone model"
#     - name: "Wireless Headphones"
#       price: 199
#       description: "Noise-cancelling headphones"

div:
  class: grid grid-cols-3 gap-4
  for product of products:
    div:
      class: border rounded-lg p-4
      content:
        - div:
            class: font-bold
            text: ${product.name}
        - div:
            class: text-gray-600
            text: "$${product.price}"
        - div:
            class: mt-2 text-sm
            text: ${product.description}
```
