# Debug

The debug component displays any data as pretty-printed JSON. It is useful during development and testing to inspect context values, form state, API responses, or any other data.

## Basic Usage

```yaml
debug: form.data
```

This renders a `<pre>` block with the JSON-stringified value of `form.data`.

## Properties

```yaml
debug:
  content: # any -- The data to display as JSON (string path to context value or inline data)
```

## Examples

### Debugging Form Data

```yaml
form:
  content:
    - input:
        label: First Name
        field: user.first_name
    - input:
        label: Last Name
        field: user.last_name
    - debug: form.data
```

As you type in the input fields, the debug component reactively displays the current form data:

```json
{
  "user": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Debugging Form Errors

```yaml
form:
  content:
    - input:
        label: Email
        field: email
    - button:
        text: Submit
        type: submit
    - debug: form.errors
```

### Debugging Server-Loaded Data

```yaml
# In the page head:
# server:
#   load:
#     contact: https://api.example.com/contacts/1

debug: contact
```

> **Tip:** Remove `debug` components before deploying to production. They are intended for development use only.
