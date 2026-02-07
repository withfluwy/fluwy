# clear_form_errors

Clears all validation errors from the current form. Must be used within a form context.

## Structure

```yaml
clear_form_errors:
```

## Examples

**Clear errors on button click:**

```yaml
form:
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
          clear_form_errors:
```

**Clear errors before resubmitting:**

```yaml
form:
  on_submit:
    clear_form_errors:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
```

## Availability

Client-side only.

## Related

- [set-form-errors](set-form-errors.md) -- Set form validation errors
- [Forms](../components/forms.md) -- Form component documentation
