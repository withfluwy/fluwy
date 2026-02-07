# page

The root container for every page. Provides full-screen height and scrolling.

## Basic Usage

```yaml
page:
  header: ...
  container: ...
  footer: ...
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes |
| `content` | Components | Child components (header, body, container, footer, etc.) |

## Behavior

- Renders with `id="page"` and full viewport height (`h-screen`)
- Automatically detects presence of sidebar and aside, adding `no-sidebar` or `no-aside` CSS classes when they are hidden
- Provides scroll overflow for the entire page

## Examples

**Simple page:**

```yaml
page:
  header:
    container_row:
      - brand:
          light: /logo.svg
          url: /
  container:
    - h1: Welcome
    - p: Hello, world!
```

**Page with sidebar layout:**

```yaml
page:
  body:
    sidebar:
      - menu_item: { text: Home, url: / }
      - menu_item: { text: About, url: /about }
    slot: default
```

## Related

- [Header](header.md) -- Top navigation bar
- [Body](body.md) -- Main content wrapper
- [Footer](footer.md) -- Page footer
- [Layout Components Overview](index.md) -- Full layout composition guide
