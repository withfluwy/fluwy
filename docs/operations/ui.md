# UI Operations

UI operations handle user interface interactions such as showing alerts, toast notifications, opening/closing dialogs, and switching color modes.

## alert

Shows a browser `window.alert()` dialog with a message. Supports template strings.

### Structure

```yaml
alert: message_or_template
```

### Examples

```yaml
button:
  text: Show Alert
  on_click:
    alert: "Hello, World!"
```

```yaml
button:
  text: Greet User
  on_click:
    alert: "Welcome, ${user.name}!"
```

**Availability:** Client-side only.

---

## notify

Shows a toast notification using the notification system (powered by [svelte-sonner](https://svelte-sonner.vercel.app/)). Supports different notification types.

### Structure

**Simple (success toast):**

```yaml
notify: "Operation completed!"
```

**With type:**

```yaml
notify:
  success: "Item saved successfully"
  # or
  error: "Something went wrong"
  # or
  info: "New update available"
  # or
  warning: "This action cannot be undone"
```

### Examples

```yaml
# Success notification after saving
button:
  text: Save
  on_click:
    post:
      url: /api/contacts
      data: form.data
    notify: "Contact saved!"
```

```yaml
# Different notification types based on result
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        notify:
          error: "Failed to save contact"
    notify:
      success: "Contact created successfully"
```

All message values support template strings (e.g., `"Saved ${contact.name}"`).

**Availability:** Client-side only.

---

## open_dialog

Opens a modal dialog with the specified content. The dialog definition is passed as a YAML object.

### Structure

```yaml
open_dialog:
  dialog:
    title: # Dialog title
    description: # Dialog description
    icon: # Optional icon
    color: # Optional color
    content: # Dialog body content
    footer: # Dialog footer content
    on_open: # Operations to run when dialog opens
```

### Example

```yaml
button:
  text: Confirm Delete
  on_click:
    open_dialog:
      dialog:
        title: Are you sure?
        description: This action cannot be undone.
        footer:
          - button:
              text: Cancel
              variant: ghost
              on_click: close_dialog
          - button:
              text: Delete
              color: destructive
              on_click:
                delete: /api/items/${item.id}
                close_dialog:
```

For full dialog documentation, see [Dialogs](../components/dialogs.md).

**Availability:** Client-side only.

---

## close_dialog

Closes the currently open dialog.

### Structure

```yaml
close_dialog:
```

### Example

```yaml
button:
  text: Done
  on_click:
    close_dialog:
```

Typically used inside dialog footer buttons. See [Dialogs](../components/dialogs.md) for full examples.

**Availability:** Client-side only.

---

## set_mode

Changes the application color mode (light, dark, or system) using [mode-watcher](https://github.com/svecosystem/mode-watcher).

### Structure

```yaml
set_mode: "light" | "dark" | "system"
```

### Examples

```yaml
# Set to dark mode
button:
  text: Dark Mode
  icon: solar:moon-linear
  on_click:
    set_mode: dark

# Set to light mode
button:
  text: Light Mode
  icon: solar:sun-linear
  on_click:
    set_mode: light

# Follow system preference
button:
  text: System
  icon: solar:monitor-linear
  on_click:
    set_mode: system
```

> **Note:** The built-in `dark_mode_toggler` layout component already provides a dropdown with all three mode options. Use `set_mode` when you need custom mode-switching UI.

**Availability:** Client-side only.
