# header

A sticky top navigation bar that stays visible while scrolling. Typically contains branding, navigation toggles, and utility buttons.

## Basic Usage

```yaml
header:
  content:
    - sidebar_toggler:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | `"header"` | Element ID |
| `class` | string | -- | Optional CSS classes |
| `content` | Components | -- | Header content items |

## Behavior

- Sticky positioned at the top (`sticky top-0 z-2`)
- Has a bottom border and backdrop blur for visual separation
- Applies theme colors for background and border
- Content is rendered as flex items

## Examples

**Header with container row:**

```yaml
header:
  class: px-0 sm:px-4
  container_row:
    - sidebar_toggler:
    - brand:
        light: /fluwy-logo-black.svg
        dark: /fluwy-logo-white.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

**Simple header:**

```yaml
header:
  content:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - button:
        text: Login
        variant: ghost
        on_click:
          goto: /login
```

## Related

- [Container](container.md) -- Centered container for header content
- [Brand](brand.md) -- Logo component
- [Sidebar Toggler](sidebar-toggler.md) -- Mobile menu toggle
- [Dark Mode Toggler](dark-mode-toggler.md) -- Theme switcher
- [Spacer](spacer.md) -- Space filler between items
