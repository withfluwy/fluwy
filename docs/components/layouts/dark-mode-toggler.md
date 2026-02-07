# dark_mode_toggler

A dropdown button that lets users switch between light, dark, and system color modes.

## Basic Usage

```yaml
dark_mode_toggler:
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `align` | string | `"end"` | Optional. Dropdown alignment |

## Behavior

- Displays a sun, moon, or contrast icon based on the current mode
- Opens a dropdown with three options: Light, Dark, System
- Active mode is highlighted with `text-primary`
- Uses the [`set_mode`](../../operations/set-mode.md) operation to change themes

## Examples

**In a header:**

```yaml
header:
  container_row:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

**With custom alignment:**

```yaml
dark_mode_toggler:
  align: start
```

## Related

- [set_mode](../../operations/set-mode.md) -- Operation for custom mode-switching UI
- [Header](header.md) -- Typical parent component
- [Theming](../../concepts/theming.md) -- Theme system overview
