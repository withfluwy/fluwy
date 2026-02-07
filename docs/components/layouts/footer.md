# footer

Page footer area for bottom-of-page content like copyright notices, links, or other supplementary information.

## Basic Usage

```yaml
footer:
  content:
    - p: "Copyright 2025 My Company"
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes |
| `content` | Components | Footer content |

## Examples

**Simple footer:**

```yaml
footer:
  class: text-center py-4
  content:
    - p: "Built with Fluwy"
```

**Footer with links:**

```yaml
footer:
  class: py-6
  content:
    - row:
        class: justify-center gap-4
        content:
          - link: { text: Privacy, url: /privacy }
          - link: { text: Terms, url: /terms }
          - link: { text: Contact, url: /contact }
```

## Related

- [Page](page.md) -- Root page container
- [Header](header.md) -- Top navigation bar
- [Body](body.md) -- Main content wrapper
