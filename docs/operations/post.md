# post

Makes a POST request to a given URL to create a new resource, injecting the response into the operation chain context.

## Structure

```yaml
post:
  url: string           # URL to send the POST request to
  data: object          # Data to send with the request (from context)
  on_error: Operations  # Optional. Operations to handle errors (status >= 300)
```

## Examples

**Creating a contact from a form:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
    notify: "Contact created!"
  content:
    - input:
        field: email
        label: Email Address
    - button:
        text: Submit
        type: submit
        color: primary
```

**With error handling:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        if response.status is 422:
          set_form_errors:
        else:
          notify:
            error: "Something went wrong"
    notify:
      success: "Contact saved!"
```

## Availability

Server and client.

## Related

- [get](get.md) -- Read resources
- [put](put.md) -- Update resources
- [delete](delete.md) -- Delete resources
- [set-form-errors](set-form-errors.md) -- Handle validation errors
- [Forms](../components/forms.md) -- Form component documentation
