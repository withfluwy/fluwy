# banner

A simple top banner container, useful for announcements or notices at the very top of the page.

## Basic Usage

```yaml
banner:
  content:
    - p: "New version available! Check out what's new."
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes |
| `content` | Components | Banner content |

## Behavior

- Renders a `<div>` with `id="banner"`
- Positioned at the very top of the page, above the header

## Examples

**Announcement banner:**

```yaml
banner:
  class: bg-primary text-white text-center py-2
  content:
    - p: "Version 2.0 is here! Read the release notes."
```

**Banner with a link:**

```yaml
banner:
  class: bg-blue-100 text-blue-800 text-center py-2
  content:
    - row:
        class: justify-center gap-2
        content:
          - text: "Join our Discord community"
          - link:
              text: Join now
              url: https://discord.gg/example
```

## Related

- [Page](page.md) -- Root page container
- [Header](header.md) -- Below the banner
