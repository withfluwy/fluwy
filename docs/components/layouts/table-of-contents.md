# table_of_contents

An auto-generated navigation component that scans the page for headings and builds a clickable, scroll-aware list of links.

## Basic Usage

```yaml
table_of_contents:
  max_level: 3
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `max_level` | number | -- | Optional. Maximum heading depth (e.g., `3` = h1-h3) |
| `selector` | string | -- | Optional. CSS selector for the content area to scan |
| `class` | string | -- | Optional CSS classes |

## Behavior

- Scans the DOM for headings within the specified selector
- Builds a hierarchical list of links
- Uses `IntersectionObserver` to highlight the currently visible heading
- Smooth-scrolls to headings on click, accounting for sticky header offset
- Re-initializes on navigation events and content changes
- Filters headings by `max_level` when specified

## Examples

**In a layout aside:**

```yaml
aside:
  class: pt-10 border-0
  table_of_contents:
    max_level: 3
    selector: "#content, .doc-content"
```

**With limited depth:**

```yaml
table_of_contents:
  max_level: 2
```

This only shows h1 and h2 headings in the table of contents.

## Related

- [Aside](aside.md) -- Typical parent component
- [Body](body.md) -- Layout that includes aside panels
