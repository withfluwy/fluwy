# spacer

A flexible space filler for flex layouts. Pushes surrounding content apart by expanding to fill all available space.

## Basic Usage

```yaml
spacer:
```

Or with custom classes:

```yaml
spacer: mt-4
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes (can be passed as the value directly) |

## Behavior

- Renders a `<div>` with `flex-1` to fill available space in flex containers
- Commonly used in headers between left and right content groups

## Examples

**Push items apart in a header:**

```yaml
header:
  container_row:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

In this example, the brand is pushed to the left and the dark mode toggler to the right.

## Related

- [Header](header.md) -- Common usage context
- [Container](container.md) -- Container row layout
