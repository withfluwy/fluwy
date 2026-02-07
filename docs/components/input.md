# Input

The input component is the basic component to collect data from users. It currently supports these types: `text` (the default), `password`, `number`, `search`, `date`.

## Basic Usage

```yaml
input:
  label: Input Text
  placeholder: Enter text here
  value: This is my value
```

## Input Types

```yaml
# Text input (default)
- input:
    icon: solar:text-linear
    placeholder: Type text

# Password input
- input:
    icon: solar:key-linear
    placeholder: Type password
    type: password

# Number input
- input:
    icon: solar:hashtag-linear
    placeholder: Type number
    type: number

# Search input
- input:
    icon: solar:magnifer-linear
    placeholder: Type search
    type: search

# Date input
- input:
    icon: solar:calendar-linear
    placeholder: Type date
    type: date
```

## Properties

```yaml
input:
  label: # string | template -- The label displayed above the input
  placeholder: # string -- Placeholder text
  value: # string -- Pre-filled value
  field: # string -- Field name for form data binding (supports dot notation)
  type: # string -- Input type: text, password, number, search, date
  icon: # string -- Leading icon (from icones.js.org)
  trailing_icon: # string -- Trailing icon
  description: # string | template -- Description text below the input
  required: # boolean -- Whether the field is required
  disabled: # boolean -- Whether the input is disabled
  loading: # boolean -- Show loading spinner
  size: # string -- Size variant: sm, md, lg, xl
  width_dynamic: # boolean -- Dynamically size width based on content
  errors: # string[] -- Array of error messages to display
  text: # string -- Additional text content
  class: # string -- Additional CSS classes
```

## Sizes

```yaml
- input:
    placeholder: Small
    size: sm
- input:
    placeholder: Medium
    size: md
- input:
    placeholder: Large
    size: lg
- input:
    placeholder: Extra Large
    size: xl
```

## With Icons and Loading

```yaml
- input:
    icon: solar:magnifer-linear
    placeholder: Input with loading
    loading: true
```

## Dynamic Width

Inputs can dynamically resize based on their content:

```yaml
- input:
    width_dynamic: true
    value: with dynamic width
```

## Custom Labels and Descriptions

Labels and descriptions can be simple strings or custom templates:

```yaml
input:
  label:
    - div: This is a custom label
    - div: Required
  description:
    - div: This is a custom description
    - div: Right side of the description
  placeholder: Enter value
```

## Error Display

Inputs can display validation errors:

```yaml
input:
  label: Email
  placeholder: Enter your email
  errors:
    - This is an error message
    - This is another error message
```

## Usage in Forms

Inputs are typically used inside a form component with the `field` property for data binding:

```yaml
form:
  content:
    - input:
        label: First Name
        field: firstName
        placeholder: Enter your first name
    - input:
        label: Email
        field: email
        type: email
```

The `field` property supports dot notation for nested data:

```yaml
input:
  label: City
  field: address.city
  placeholder: Enter city
```
