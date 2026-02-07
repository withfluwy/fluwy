# container / container_row

A centered, max-width container using Tailwind's `container` utility. `container_row` adds a horizontal flex layout, useful for header content.

## Basic Usage

**Container:**

```yaml
container:
  class: py-8
  content:
    - h1: Welcome
    - p: This content is centered with a max width.
```

**Container Row:**

```yaml
container_row:
  - sidebar_toggler:
  - brand:
      light: /logo.svg
      url: /
  - spacer:
  - dark_mode_toggler:
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional additional CSS classes |
| `content` | Components | Nested content |

## Behavior

- **`container`**: Renders a centered `<div>` with Tailwind's `container` class and auto margins
- **`container_row`**: Combines `container` with `flex items-center gap-3` for horizontal layout

## Examples

**Container in a page layout:**

```yaml
page:
  header:
    container_row:
      - brand:
          light: /logo.svg
          url: /
      - spacer:
      - dark_mode_toggler:
  container:
    - h1: Page Title
    - p: Centered page content.
```

## Related

- [Header](header.md) -- Common parent for container_row
- [Page](page.md) -- Root page container
