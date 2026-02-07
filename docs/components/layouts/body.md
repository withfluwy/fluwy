# body

The main content wrapper that organizes header, sidebar, main content, aside, and footer within a page. Arranges its children in a flex row layout.

## Basic Usage

```yaml
body:
  sidebar:
    - menu_item: { text: Home, url: / }
  slot: default
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `header` | Component | Optional. Header component within the body |
| `sidebar` | Components | Optional. Sidebar navigation content |
| `aside` | Component | Optional. Right-side panel content |
| `footer` | Component | Optional. Footer component within the body |
| `slot` | string | Where page content goes (typically `default`) |

## Behavior

- Arranges children in a flex row layout
- Sidebar appears on the left, main content in the center, aside on the right
- Main content area (`<main>`) grows to fill available space
- Components (header, sidebar, footer, aside) are conditionally rendered only when provided

## Examples

**Body with sidebar and aside:**

```yaml
body:
  sidebar:
    - menu_item: { text: Home, url: / }
    - menu_item: { text: Docs, url: /docs }
  aside:
    class: pt-10 border-0
    table_of_contents:
      max_level: 3
  slot: default
```

**Body with header inside:**

```yaml
body:
  header:
    content:
      - sidebar_toggler:
      - spacer:
      - dark_mode_toggler:
  sidebar:
    - brand:
        light: /logo.svg
        url: /
    - menu_item: { text: Dashboard, url: /dashboard }
  slot: default
```

## Related

- [Sidebar](sidebar.md) -- Navigation sidebar
- [Aside](aside.md) -- Right-side panel
- [Page](page.md) -- Root page container
