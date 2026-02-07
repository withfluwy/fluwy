# put

Makes a PUT request to a given URL to update an existing resource, injecting the response into the operation chain context.

## Structure

```yaml
put:
  url: string           # URL to send the PUT request to
  data: object          # Data to send with the request (from context)
  on_error: Operations  # Optional. Operations to handle errors (status >= 300)
```

## Examples

**Updating a contact from a form:**

```yaml
form:
  data:
    id: 1
    email: contact@mail.com
  on_submit:
    put:
      url: /api/contacts/${form.data.id}
      data: form.data
      on_error:
        alert: ${response.statusText}
    notify: "Contact updated!"
  content:
    - input:
        field: email
        label: Email Address
    - button:
        text: Update
        type: submit
        color: primary
        icon: solar:pen-linear
```

> **Note:** The placeholder `${form.data.id}` in the `url` parameter is a template string that will be replaced with the value from the context. This is how you target a specific resource for updates.

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

## Availability

Server and client.

## Related

- [get](get.md) -- Read resources
- [post](post.md) -- Create resources
- [delete](delete.md) -- Delete resources
- [if](if.md) -- Conditional operations
