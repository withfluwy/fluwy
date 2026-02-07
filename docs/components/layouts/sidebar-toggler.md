# sidebar_toggler

A button that opens/closes the mobile sidebar. Only visible on mobile screens (hidden on desktop).

## Basic Usage

```yaml
sidebar_toggler:
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | string | Bars icon | Optional. Custom icon |
| `color` | string | -- | Optional. Button color |
| `class` | string | -- | Optional CSS classes |

## Behavior

- Emits a `ToggleSidebar` event on click
- Hidden on desktop screens (`lg:hidden`)
- Uses ghost button variant by default

## Examples

**In a header:**

```yaml
header:
  container_row:
    - sidebar_toggler:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

**Custom icon:**

```yaml
sidebar_toggler:
  icon: solar:hamburger-menu-linear
```

## Related

- [Sidebar](sidebar.md) -- The sidebar it toggles
- [Header](header.md) -- Typical parent component
