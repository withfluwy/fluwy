# Forms

The form component is the basic component to collect data from users. It creates its own context to manipulate data. You should use the form component to wrap input fields and buttons to change data and submit it to an API server.

> **Note**: The form component is a work in progress. More features and documentation will be added in the future. We don't intend to change its API though. In the meantime you can join the Discord community or open an issue on GitHub to get help or request features.

## Basic Form

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        set_form_errors:
  content:
    - row:
        - input:
            label: First Name
            field: firstName
            placeholder: Enter your first name
        - input:
            label: Last Name
            field: lastName
            placeholder: Enter your last name
    - input:
        label: Email Address
        field: email
        placeholder: Enter your email address
    - row:
        - button:
            text: Clear Errors
            icon: solar:eraser-linear
            on_click:
              clear_form_errors:
        - button:
            text: Submit
            type: submit
            class: grow
            color: primary
            icon: solar:plain-3-linear
```

## Properties

```yaml
form:
  # The unique identifier for the form.
  id: string

  # The initial data to populate the form with.
  # This is useful when editing existing records.
  data: Record<string, Any>

  # The operations to run when the form is submitted.
  # This can include HTTP requests and other actions.
  on_submit: Operations

  # Additional CSS classes to style the form
  class: string
```

> **Note**: Did you notice that the submit button is disabled when the form is submitting and it displays a spinner? In form components, the spinner is **only displayed when the form is submitting and the operation is taking more than 150 milliseconds** to complete. If the request is too quick you won't see the spinner.

## Form State

The form component creates a context that can be accessed by child components and operations. This context contains the current state of the form:

```yaml
# The current form data
form.data          # Record<string, Any>

# Current validation errors
form.errors        # Record<string, string[]>

# Whether the form is currently being submitted
form.submitting    # boolean

# Whether the form data has been changed
form.pristine      # boolean

# Whether the form data has been changed. Opposite alias for form.pristine
form.dirty         # boolean
```

### Form Data

The `form.data` can be used in various operations and components. Here are some common use cases:

**Submitting form data to an API:**

```yaml
form:
  on_submit:
    post:
      url: /api/users
      data: form.data
```

**Debugging form data:**

```yaml
form:
  on_submit:
    log: form.data
```

Or using the debug component:

```yaml
form:
  ...
  content:
    debug: form.data
```

## Operations

The form component can execute any operation when submitted. Here are some common operations used with forms:

```yaml
# HTTP Operations
post:
  url: string        # The URL to send the request to
  data: object       # The data to send with the request
  on_error: Operations  # Operations to run on error

# Form Operations
set_form_errors:
  if_response_status: 422  # Optional. Defaults to 400 (Bad Request)

clear_form_errors:         # Clear all form errors

# Other Operations
sleep: number              # The number of milliseconds to wait
```

> **Note**: You can use any operation defined in your app. More operations are documented on the [Operations](../operations/index.md) page.

## Validations

Fluwy encourages the use of server-side validations only which is more secure and reliable. For that purpose, it comes with built-in operations to help you manage validations that came from the backend. We also provide plugins for some frameworks.

**PayloadCMS:**

```yaml
# In your theme file:
form:
  on_submit:
    post:
      url: /path/to/endpoint
      data: form.data
      on_error:
        payloadcms.set_form_errors:
```

> **Note**: Implementing plugins for other frameworks is straightforward. You can find the source code for the PayloadCMS plugin in the [GitHub repository](https://github.com/withfluwy/fluwy/tree/main/src/lib/plugins/payloadcms/index.ts).

## Debugging

The debug component can be used to debug the form state. It can display the current form data, errors, or anything else you want. This is useful for debugging and testing purposes.

```yaml
form:
  content:
    - row:
        - input:
            label: First Name
            field: user.first_name
        - input:
            label: Last Name
            field: user.last_name
    # Use the debug component to display any object
    # you want that can be JSON stringified.
    - debug: form.data
```

## Nested Form Data

Forms support nested data structures using dot notation in field names:

```yaml
form:
  data:
    firstName: John
    lastName: Doe
    email: john.doe
    address:
      line1: 123 Main St
      city: London
      country: UK
  on_submit:
    post:
      url: /api/contacts
      data: form.data
  content:
    - input:
        field: email
        placeholder: Email Address
    - input:
        label: Address
        field: address.line1
        placeholder: Address Line 1
    - row:
        - input:
            field: address.city
            placeholder: City
        - input:
            field: address.country
            placeholder: Country
    - button:
        text: Submit
        type: submit
        color: primary
```

## Related

- [Input](input.md) -- Input field types and configuration
- [Buttons](buttons.md) -- Submit and action buttons
- [`set_form_errors`](../operations/set-form-errors.md) -- Set validation errors from API
- [`clear_form_errors`](../operations/clear-form-errors.md) -- Clear form errors
- [`post`](../operations/post.md) -- Submit form data to an API
- [Context](../concepts/context.md) -- Form state in the context (`form.data`, `form.errors`)
