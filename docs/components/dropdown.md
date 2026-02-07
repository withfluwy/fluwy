# Dropdown

The dropdown component provides a floating menu that appears when a trigger element is clicked. It supports items, labels, separators, submenus, and custom operations on click.

## Basic Usage

```yaml
dropdown:
  trigger:
    button:
      text: Options
      icon: solar:menu-dots-linear
  content:
    - dropdown_item:
        text: Edit
        icon: solar:pen-linear
        on_click:
          goto: /edit
    - dropdown_item:
        text: Delete
        icon: solar:trash-bin-trash-linear
        on_click:
          alert: "Item deleted"
```

## Components

The dropdown system consists of four components that work together:

| Component | YAML Name | Purpose |
|-----------|-----------|---------|
| Dropdown | `dropdown` | Container with trigger and menu |
| DropdownItem | `dropdown_item` | Clickable menu item |
| DropdownLabel | `dropdown_label` | Section heading |
| DropdownSeparator | `dropdown_separator` | Horizontal divider |

---

## Dropdown

The main container that manages the trigger button and floating menu.

### Properties

```yaml
dropdown:
  trigger: # Required. Component(s) to render as the trigger button
  content: # Required. Menu items (dropdown_item, dropdown_label, dropdown_separator)
  align: # Optional. "start" | "center" | "end" -- Alignment relative to trigger
  class: # Optional CSS classes
```

### Example

```yaml
dropdown:
  align: end
  trigger:
    button:
      icon: solar:hamburger-menu-linear
      variant: ghost
  content:
    - dropdown_label: Account
    - dropdown_item:
        text: Profile
        icon: solar:user-linear
        on_click:
          goto: /profile
    - dropdown_item:
        text: Settings
        icon: solar:settings-linear
        on_click:
          goto: /settings
    - dropdown_separator:
    - dropdown_item:
        text: Logout
        icon: solar:logout-2-linear
        on_click:
          unset_auth_token:
          goto: /login
```

---

## Dropdown Item

A clickable item within the dropdown menu.

### Properties

```yaml
dropdown_item:
  text: # Optional. Item label text
  icon: # Optional. Leading icon (string or IconProps)
  on_click: # Optional. Operations to execute on click
  sub_content: # Optional. Creates a submenu with nested items
  content: # Optional. Custom content (alternative to text)
  class: # Optional CSS classes
```

### Simple Item

```yaml
dropdown_item:
  text: Edit Profile
  icon: solar:pen-linear
  on_click:
    goto: /profile/edit
```

### Submenu

Items can contain nested submenus via the `sub_content` property:

```yaml
dropdown_item:
  text: More Options
  icon: solar:menu-dots-linear
  sub_content:
    - dropdown_item:
        text: Export
        icon: solar:export-linear
    - dropdown_item:
        text: Archive
        icon: solar:archive-linear
```

---

## Dropdown Label

A non-interactive section heading within the dropdown.

### Properties

```yaml
dropdown_label:
  content: # Required. Label text
  class: # Optional CSS classes
```

### Example

```yaml
dropdown_label: Account Settings
```

---

## Dropdown Separator

A horizontal divider between dropdown sections.

### Properties

```yaml
dropdown_separator:
  class: # Optional CSS classes
```

### Example

```yaml
dropdown_separator:
```

---

## Complete Example

A user account dropdown with sections, items, and a logout action:

```yaml
dropdown:
  align: end
  trigger:
    row:
      class: items-center gap-2 cursor-pointer
      content:
        - avatar:
            name: ${user.name}
            src: ${user.avatar}
            size: sm
        - text: ${user.name}
  content:
    - dropdown_label: ${user.email}
    - dropdown_separator:
    - dropdown_item:
        text: Profile
        icon: solar:user-linear
        on_click:
          goto: /profile
    - dropdown_item:
        text: Settings
        icon: solar:settings-linear
        on_click:
          goto: /settings
    - dropdown_item:
        text: Theme
        icon: solar:palette-linear
        sub_content:
          - dropdown_item:
              text: Light
              on_click:
                set_mode: light
          - dropdown_item:
              text: Dark
              on_click:
                set_mode: dark
          - dropdown_item:
              text: System
              on_click:
                set_mode: system
    - dropdown_separator:
    - dropdown_item:
        text: Logout
        icon: solar:logout-2-linear
        on_click:
          unset_auth_token:
          goto: /login
```

## Related

- [Buttons](buttons.md) -- Trigger elements for dropdowns
- [`unset_auth_token`](../operations/unset-auth-token.md) -- Logout from dropdown menus
- [`goto`](../operations/goto.md) -- Navigation from dropdown items
- [`set_mode`](../operations/set-mode.md) -- Theme switching from dropdown items
