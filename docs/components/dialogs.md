# Dialogs

Dialogs are modal windows that appear in front of the main content to provide critical information or ask for user decisions. They're commonly used for confirmations, alerts, and form inputs. Dialogs create a focused mode of interaction by temporarily blocking interactions with the main content, ensuring users make conscious decisions about important actions.

## Basic Usage

A basic dialog can be opened using the `open_dialog` operation. The dialog component supports various properties including `title`, `description`, `icon`, `color`, `content`, and `footer`.

```yaml
button:
  text: Open Dialog
  on_click:
    open_dialog:
      dialog:
        title: Basic Dialog
        description: This is a basic dialog with a title and a description.
        footer:
          - button:
              text: Cancel
              variant: ghost
              on_click: close_dialog
          - button:
              text: Done
              color: primary
              autofocus: true
              on_click: close_dialog
```

## Properties

```yaml
dialog:
  title: # template -- Template to render in the title
  description: # template -- Template to render in the description
  icon: # string or IconProps -- Any icon from icones.js.org
  color: # string -- Any color from the theme
  content: # template -- Template to render in the content area
  footer: # template -- Template to render in the footer
  on_open: # operations -- Operations to run when the dialog is opened
```

## Theme Settings

```yaml
common:
  dialog:
    overlay:
    wrapper:
    title:
    description:
    content:
    footer:
```

## Confirmation Dialogs

For confirmation dialogs with danger actions you can use a danger confirmation dialog with a form input. Here's an example:

```yaml
button:
  text: Open Danger Dialog
  color: destructive
  on_click:
    open_dialog:
      dialog:
        icon: solar:danger-triangle-linear
        color: destructive
        title: Are you sure?
        description: This operation cannot be undone.
        content:
          form:
            data:
              confirmation:
            content:
              input:
                placeholder: Type "DELETE" to confirm
                field: confirmation
              row:
                class: justify-end
                content:
                  - button:
                      text: Cancel
                      variant: ghost
                      on_click: close_dialog
                  - button:
                      text: Deactivate
                      color: destructive
                      autofocus: true
                      disabled: form.data.confirmation is not "DELETE"
                      on_click: close_dialog
```

## Dialog with Form

Dialogs can contain forms for data input. Here's an example of a contact form within a dialog:

```yaml
button:
  text: Add Contact
  color: primary
  icon: solar:user-plus-rounded-linear
  on_click:
    open_dialog:
      dialog:
        title: Add New Contact
        description: Please fill in the contact details below.
        content:
          form:
            on_submit:
              close_dialog:
            content:
              - row:
                  - input:
                      label: First Name
                      field: firstName
                  - input:
                      label: Last Name
                      field: lastName
              - input:
                  label: Email Address
                  field: email
                  type: email
                  icon: solar:letter-linear
              - input:
                  label: Phone Number
                  field: phone
                  icon: solar:phone-linear
              - row:
                  class: justify-end
                  content:
                    - button:
                        text: Cancel
                        variant: ghost
                        on_click: close_dialog
                    - button:
                        text: Save Contact
                        color: primary
                        type: submit
                        icon: solar:user-check-rounded-linear
```

## Dialog with Loaded Content

Dialogs can be used to load content from the server. Here's an example of a dialog with a contact form loaded from the server:

```yaml
button:
  text: Edit Contact
  on_click:
    open_dialog:
      dialog:
        title: Edit Contact
        description: Please fill in the contact details below.
        on_open:
          get: /api/examples/contacts/1
          vars:
            contact: response.data.data
        content:
          form:
            data: contact
            content:
              - row:
                  - input:
                      label: First Name
                      field: firstName
                  - input:
                      label: Last Name
                      field: lastName
              - input:
                  label: Email Address
                  field: email
                  type: email
                  icon: solar:letter-linear
              - input:
                  label: Phone Number
                  field: phone
                  icon: solar:phone-linear
              - row:
                  class: justify-end
                  content:
                    - button:
                        text: Cancel
                        variant: ghost
                        on_click: close_dialog
                    - button:
                        text: Save Contact
                        color: primary
                        icon: solar:user-check-rounded-linear
                        on_click: close_dialog
```

## Very Long Dialog

Dialogs can be very long and scrollable:

```yaml
button:
  text: Open Long Dialog
  on_click:
    open_dialog:
      dialog:
        title: This is a very long dialog
        description: This is a very long dialog with a title and a description and a button.
        content:
          60 times with number do:
            text: This is a very long content of number ${number}
        footer:
          - button:
              text: Cancel
              variant: ghost
              on_click: close_dialog
          - button:
              text: I agree
              color: primary
              autofocus: true
              on_click:
                - alert: You agreed
                - close_dialog:
```
