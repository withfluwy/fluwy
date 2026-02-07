# brand

A logo component with light/dark mode image switching. Clicking the brand navigates to the specified URL.

## Basic Usage

```yaml
brand:
  light: /logo-black.svg
  dark: /logo-white.svg
  url: /
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `light` | string | -- | **Required.** Image URL for light mode |
| `dark` | string | Same as `light` | Optional. Image URL for dark mode |
| `url` | string | -- | **Required.** Link destination when clicked |
| `class` | string | -- | Optional CSS classes |

## Examples

**Brand with light/dark variants:**

```yaml
brand:
  class: mx-4 my-3
  light: /fluwy-logo-black.svg
  dark: /fluwy-logo-white.svg
  url: /
```

**Brand in a header:**

```yaml
header:
  container_row:
    - brand:
        light: /logo.svg
        url: /
    - spacer:
    - dark_mode_toggler:
```

## Related

- [Header](header.md) -- Typical parent component
- [Sidebar](sidebar.md) -- Brand can also go in the sidebar
