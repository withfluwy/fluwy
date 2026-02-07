# Form Operations

This document groups all operations that are used within a form component and context.

## clear_form_errors

The `clear_form_errors` operation is used to clear the form errors. It should be used in a form context. Inside a form component you can add this operation on a button click.

### Example

```yaml
form:
  data:
    email: invalid
  content:
    - input:
        label: Name
        field: name
        errors:
          - This field is required.
    - input:
        label: Email
        field: email
        errors:
          - This email is invalid.
    - button:
        text: Clear errors
        on_click:
          - clear_form_errors:
```

## set_form_errors

The `set_form_errors` operation is used to set form validation errors from an API response. When a server returns validation errors, this operation maps them to the corresponding form fields.

### Usage

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
```

### With Custom Status Code

By default, `set_form_errors` triggers on HTTP 400 (Bad Request) responses. You can customize this:

```yaml
set_form_errors:
  if_response_status: 422  # Unprocessable Entity
```

### With PayloadCMS Plugin

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

## Related

- [Forms Component](../components/forms.md) -- Full form component documentation
- [HTTP Operations](http.md) -- Making HTTP requests
- [Operations Overview](index.md) -- How operations work in general
