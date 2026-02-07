# Tutorial: Build a Contacts App

This tutorial walks you through building a complete contacts management application with Fluwy. By the end, you'll have a working app with a dashboard layout, a contacts table, a form dialog for creating contacts, and edit/delete functionality.

**Prerequisites:** A Fluwy project set up and running. See [Getting Started](getting-started.md) if you haven't done this yet.

---

## Step 1: Create a Simple Contacts Page

Let's start with a basic page that displays a heading and a table of contacts.

Create `app/pages/index.yaml`:

```yaml
server:
  load:
    contacts: https://jsonplaceholder.typicode.com/users
---
h1: Contacts
p: Manage your contacts from this page.
table:
  id: contacts_table
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content: ${record.email}
    - header: Phone
      content: ${record.phone}
```

**What's happening here:**

- The `server:` section runs before the page renders. `load` fetches data from the API and stores it in a `contacts` variable.
- The `---` separator divides the page head (metadata) from the body (content).
- `data: contacts` passes the actual array by referencing the context path directly (without `${}`). Template strings like `${...}` are for inserting values into **text strings** -- if you used `${contacts}` here, the array would be converted to a string like `[object Object]`.
- `${record.name}` works inside `content` because we're inserting a value into a display string.

Visit your app at `http://localhost:5173` and you should see a table with names, emails, and phone numbers.

---

## Step 2: Add a Layout with Header and Sidebar

A single page is fine for testing, but real apps need navigation. Let's create a layout.

Create `app/layouts/main.yaml`:

```yaml
---
page:
  body:
    header:
      content:
        - sidebar_toggler:
        - spacer:
        - dark_mode_toggler:
    sidebar:
      content:
        - brand:
            class: mx-4 my-3
            light: /fluwy-logo-black.svg
            dark: /fluwy-logo-white.svg
            url: /
        - menu_item:
            icon: solar:users-group-rounded-linear
            text: Contacts
            url: /
        - menu_item:
            icon: solar:settings-linear
            text: Settings
            url: /settings
    slot: default
```

Now update your page to use this layout. Edit `app/pages/index.yaml` and add `layout: main` at the top:

```yaml
layout: main
server:
  load:
    contacts: https://jsonplaceholder.typicode.com/users
---
h1: Contacts
p: Manage your contacts from this page.
table:
  id: contacts_table
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content: ${record.email}
    - header: Phone
      content: ${record.phone}
```

Refresh the page. You now have a sidebar with navigation and a header with a dark mode toggler.

---

## Step 3: Add a "New Contact" Button with a Form Dialog

Let's add a button that opens a dialog with a form to create new contacts.

Update `app/pages/index.yaml` to add a button above the table:

```yaml
layout: main
server:
  load:
    contacts: https://jsonplaceholder.typicode.com/users
---
h1: Contacts
p: Manage your contacts from this page.

button:
  text: New Contact
  color: primary
  icon: solar:add-circle-linear
  on_click:
    open_dialog:
      dialog:
        title: Create Contact
        description: Fill in the details for your new contact.
        content:
          form:
            on_submit:
              post:
                url: https://jsonplaceholder.typicode.com/users
                data: form.data
                on_error:
                  set_form_errors:
              close_dialog:
              refresh: contacts_table
              notify: "Contact created!"
            content:
              - input:
                  field: name
                  label: Full Name
              - input:
                  field: email
                  label: Email
                  type: email
              - input:
                  field: phone
                  label: Phone
              - button:
                  text: Create Contact
                  type: submit
                  color: primary

table:
  id: contacts_table
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}
    - header: Phone
      content: ${record.phone}
```

**What's happening here:**

- `open_dialog` opens a modal with the specified content.
- The `form` component inside the dialog manages form state automatically.
- `on_submit` defines the operation chain: POST the data, close the dialog, refresh the table, and show a notification.
- `set_form_errors` maps any validation errors from the API to the form fields.
- `refresh: contacts_table` tells the table to re-fetch its data.

---

## Step 4: Add Display Formatting

Let's improve the table by formatting emails as clickable links and adding a relative date column.

Update the table columns:

```yaml
table:
  id: contacts_table
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}
    - header: Phone
      content:
        if record.phone:
          phone: ${record.phone}
    - header: Website
      content: ${record.website}
```

Now emails are clickable `mailto:` links, and phone numbers only show when they exist.

---

## Step 5: Add a Delete Action

Let's add a delete button for each contact using a confirmation dialog.

Add a new column to the table:

```yaml
table:
  id: contacts_table
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}
    - header: Phone
      content:
        if record.phone:
          phone: ${record.phone}
    - header: Actions
      content:
        button:
          text: Delete
          variant: ghost
          color: destructive
          size: sm
          on_click:
            open_dialog:
              dialog:
                title: Delete Contact
                description: "Are you sure you want to delete ${record.name}? This cannot be undone."
                footer:
                  - button:
                      text: Cancel
                      variant: ghost
                      on_click: close_dialog
                  - button:
                      text: Delete
                      color: destructive
                      on_click:
                        delete: https://jsonplaceholder.typicode.com/users/${record.id}
                        close_dialog:
                        refresh: contacts_table
                        notify: "Contact deleted"
```

Each row now has a Delete button that opens a confirmation dialog before actually deleting.

---

## Step 6: Apply a Theme

Create a theme file at `app/themes/main.yaml` to customize the look:

```yaml
button:
  class: rounded-lg
  primary:
    class: shadow-md

table:
  class: border rounded-lg

input:
  class: rounded-lg

displays:
  date_format: "MMM D, YYYY"
```

Then reference the theme in your layout. Update `app/layouts/main.yaml` to add `theme: main`:

```yaml
theme: main
---
page:
  body:
    header:
      content:
        - sidebar_toggler:
        - spacer:
        - dark_mode_toggler:
    sidebar:
      content:
        - brand:
            class: mx-4 my-3
            light: /fluwy-logo-black.svg
            dark: /fluwy-logo-white.svg
            url: /
        - menu_item:
            icon: solar:users-group-rounded-linear
            text: Contacts
            url: /
        - menu_item:
            icon: solar:settings-linear
            text: Settings
            url: /settings
    slot: default
```

All pages using the `main` layout will now inherit these theme styles.

---

## What You've Learned

In this tutorial you've covered the core building blocks of a Fluwy application:

1. **Server-side data loading** with `load` in the page head
2. **Layout composition** with `page`, `body`, `header`, `sidebar`, and `slot`
3. **Tables** with formatted columns using display components
4. **Form dialogs** with validation and submission handling
5. **Operation chains** combining `post`, `close_dialog`, `refresh`, and `notify`
6. **Confirmation patterns** with `open_dialog` and `delete`
7. **Theming** with a shared theme file

## Next Steps

- Explore all available [Components](README.md#components) and [Operations](README.md#operations)
- Learn about [Routing](concepts/routing.md) for multi-page apps
- Read about [Plugins](concepts/plugins.md) to extend Fluwy with custom functionality
- Understand the [Context](concepts/context.md) system for managing data flow
