# aside

A right-side panel, typically used for supplementary content like a table of contents. Only visible on extra-large screens.

## Basic Usage

```yaml
aside:
  class: pt-10 border-0
  table_of_contents:
    max_level: 3
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes |
| `content` | Components | Aside content (typically a table of contents) |

## Behavior

- Sticky positioned, only visible on extra-large screens (`xl:block`)
- Fixed width (`w-64`) with full viewport height
- Scrollable content area
- Hidden on mobile and tablet

## Examples

**Aside with table of contents:**

```yaml
aside:
  class: pt-10 border-0
  table_of_contents:
    max_level: 3
    selector: "#content, .doc-content"
```

**Used in a body layout:**

```yaml
body:
  sidebar:
    - menu_item: { text: Home, url: / }
  aside:
    table_of_contents:
      max_level: 2
  slot: default
```

## Related

- [Table of Contents](table-of-contents.md) -- Auto-generated heading navigation
- [Body](body.md) -- Parent wrapper component
- [Sidebar](sidebar.md) -- Left-side navigation
