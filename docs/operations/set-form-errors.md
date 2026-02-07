# set_form_errors

Sets form validation errors from an API response. When a server returns validation errors, this operation maps them to the corresponding form fields.

## Structure

```yaml
# Default (triggers on HTTP 400)
set_form_errors:

# Custom status code
set_form_errors:
  if_response_status: 422  # Unprocessable Entity
```

## Examples

**Basic form error handling:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
  content:
    - input:
        field: email
        label: Email Address
    - button:
        text: Submit
        type: submit
        color: primary
```

**With custom status code:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
          if_response_status: 422
```

**With PayloadCMS plugin:**

If you're using PayloadCMS, use the plugin's version which handles PayloadCMS-specific error formats:

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        payloadcms.set_form_errors:
```

## Availability

Client-side only.

## Related

- [clear-form-errors](clear-form-errors.md) -- Clear all form errors
- [Forms](../components/forms.md) -- Form component documentation
- [post](post.md) -- Making POST requests
