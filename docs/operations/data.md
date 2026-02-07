# Data Operations

Data operations are used to manipulate, store, and transform data within the operation chain context. They allow you to set variables, log information, extract fields, and reshape data structures.

## vars

Sets one or more variables in the context. Values can be literal strings or template expressions that reference other context values.

### Structure

```yaml
vars:
  variable_name: value_or_template
```

### Examples

**Setting variables from an API response:**

```yaml
server:
  get: https://api.example.com/contacts/${params.id}
  vars:
    contact: response.data
```

**Setting multiple variables:**

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

Variables set with `vars` become available in the context and can be referenced anywhere using `${variable_name}` template syntax.

**Availability:** Server and client.

---

## log

Logs a message to the browser console (or server console). Useful for debugging operation chains.

### Structure

```yaml
log: message_or_template
```

### Examples

```yaml
# Simple message
log: "Button was clicked"

# With context data
log: "User ${user.name} submitted form"

# Debugging response data
button:
  text: Submit
  on_click:
    post:
      url: /api/contacts
      data: form.data
    log: "Response status: ${response.status}"
```

**Availability:** Server and client.

---

## context

Retrieves a value from the context by its path and returns it as the operation result.

### Structure

```yaml
context: path.to.value
```

### Example

```yaml
button:
  on_click:
    context: user.id
    log: "Retrieved user ID"
```

**Availability:** Server and client.

---

## extract

Extracts specific fields from the previous operation result using a mapping. Creates a new object with only the specified fields, optionally renaming them.

### Structure

```yaml
extract:
  new_key: source.path.to.value
  another_key: another.source.path
```

### Example

```yaml
button:
  on_click:
    get: https://api.example.com/user/123
    extract:
      firstName: data.profile.firstName
      lastName: data.profile.lastName
      email: data.contact.email
    log: "Extracted: ${firstName} ${lastName}"
```

The `extract` operation flattens the previous result into dot-notation keys, picks the ones you specify, and builds a new object.

**Availability:** Server and client.

---

## transform

Renames keys in the previous operation result. This is useful when your API returns keys in one format but you need them in another.

### Structure

```yaml
transform:
  old_key: new_key
```

### Example

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

**Availability:** Server and client.

---

## wrap_into

Wraps the previous operation result into a new object under the specified key.

### Structure

```yaml
wrap_into: key_name
```

### Example

```yaml
button:
  on_click:
    get: https://api.example.com/contacts
    wrap_into: contacts_response
```

If the `get` returned `{ data: [...] }`, the result becomes `{ contacts_response: { data: [...] } }`.

**Availability:** Server and client.
