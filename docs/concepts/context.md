# Context

The Context is Fluwy's reactive state management system. It's a key-value store that holds all the data your pages, components, and operations need -- route parameters, server-loaded data, form state, operation results, and custom variables.

## How It Works

Every page has a Context instance that flows through all its components and operations. The context is available on both the server (during page rendering) and the client (during user interactions). When a value in the context changes, components that reference it update automatically.

## Template Strings

You access context values in YAML using template strings with the `${...}` syntax:

```yaml
h1: Hello, ${user.name}!
p: You have ${notifications.count} unread messages.
```

Template strings support dot notation to access nested properties:

```yaml
# Access nested objects
p: ${contact.address.city}

# Access array items (bracket notation)
p: ${contacts[0].name}
```

> **Important:** Template strings (`${...}`) are for inserting values into strings. They are **not** used in conditions. See [Conditions](../controls/conditions.md) for condition syntax.

### Template Strings vs Plain Context Paths

This is a critical distinction in Fluwy:

- **Template strings (`${...}`)** insert a value into a **text string**. Internally they use JavaScript's `String.replace()`, which calls `.toString()` on the resolved value. This means objects and arrays are converted to `[object Object]` instead of being passed as actual data.
- **Plain context paths** (without `${}`) resolve to the **actual value** -- object, array, number, boolean, or string -- preserving its type.

**Rule of thumb:** Use `${...}` when you need a value inside a text string. Use plain paths when you need to pass the actual data structure.

```yaml
# CORRECT -- plain path passes the actual array to the table
table:
  data: contacts

# WRONG -- ${} converts the array to "[object Object]"
table:
  data: ${contacts}

# CORRECT -- ${} inserts a string value into text
h1: Hello, ${user.name}!

# CORRECT -- plain path passes the actual object to post
post:
  url: /api/contacts
  data: form.data

# CORRECT -- ${} inserts a value into a URL string
get: https://api.example.com/contacts/${params.id}
```

Component properties that expect objects or arrays (like `data` on tables, or `data` on `post`/`put` operations) should always use plain context paths. Properties that expect display text (like `content`, `text`, `title`, or URL strings) use `${...}` template strings.

## Available Context Paths

### Route Parameters (`params`)

Dynamic route parameters from the URL are available under `params`:

```yaml
# For a page at app/pages/contacts/[id]/index.yaml
# URL: /contacts/42

server:
  get: https://api.example.com/contacts/${params.id}
  # params.id = "42"
```

### Server-Loaded Data

Variables set with [`load`](../operations/load.md) or [`vars`](../operations/vars.md) on the server become top-level context keys:

```yaml
server:
  load:
    contacts: https://api.example.com/contacts
    stats: https://api.example.com/stats
---
# contacts and stats are now available as context variables
h1: "Total contacts: ${stats.total}"
```

### Form State (`form`)

Inside a `form` component, form-related data is available under the `form` path:

| Path | Description |
|------|-------------|
| `form.data` | Current form field values |
| `form.data.field_name` | Value of a specific field |
| `form.errors` | Validation errors by field |
| `form.submitting` | Boolean, true while the form is being submitted |

```yaml
form:
  data:
    name: "John"
    email: "john@example.com"
  on_submit:
    post:
      url: /api/contacts
      data: form.data
  content:
    - input:
        field: name
        label: Name
    - input:
        field: email
        label: Email
    - button:
        text: Save
        type: submit
```

### Operation Results (`response`)

After an HTTP operation (`get`, `post`, `put`, `delete`), the response is available under `response`:

| Path | Description |
|------|-------------|
| `response.data` | Response body data |
| `response.status` | HTTP status code |
| `response.statusText` | HTTP status text |

```yaml
button:
  on_click:
    post:
      url: /api/contacts
      data: form.data
    log: "Status: ${response.status}"
    vars:
      new_contact: response.data
```

### Custom Variables

Variables set with [`vars`](../operations/vars.md) become available at the path you specify:

```yaml
server:
  get: https://api.example.com/me
  vars:
    user: response.data
    greeting: "Hello, ${response.data.name}!"
---
h1: ${greeting}
p: "Email: ${user.email}"
```

## Server vs Client Context

The context exists in two phases:

1. **Server-side** -- During page load, the `server:` section runs. Operations like `load`, `get`, `authenticate`, and `vars` execute on the server. The resulting context is passed to the client for rendering.

2. **Client-side** -- During user interactions (`on_click`, `on_submit`, etc.), operations run in the browser. They can read and modify the context that was established on the server.

```yaml
# Server-side: load data and set variables
server:
  authenticate:
    redirect: /login
  load:
    profile: https://api.example.com/me
---
# Client-side: use server-loaded data and respond to events
h1: Welcome, ${profile.name}
button:
  text: Update Profile
  on_click:
    put:
      url: https://api.example.com/me
      data: form.data
    # response.data is now available in the client context
    vars:
      profile: response.data
    notify: "Profile updated!"
```

## Related

- [vars](../operations/vars.md) -- Set context variables
- [load](../operations/load.md) -- Load data into context on the server
- [YAML Syntax](yaml-syntax.md) -- How YAML maps to UI components
- [Routing](routing.md) -- Dynamic parameters and `params`
