# menu_item

A navigation link that highlights when its URL matches the current page. Used in sidebars and menu groups to build navigation menus.

## Basic Usage

```yaml
menu_item:
  text: Documentation
  url: /docs
  icon: solar:notebook-minimalistic-linear
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | -- | Optional. Label text |
| `url` | string | -- | Optional. Link destination |
| `icon` | string | -- | Optional. Leading icon from [icones.js.org](https://icones.js.org) |
| `trailing_icon` | string | -- | Optional. Trailing icon |
| `class` | string | -- | Optional CSS classes |
| `content` | Components | -- | Optional. Custom content instead of text |

## Behavior

- Renders as an `<a>` tag when `url` is provided, or a `<div>` otherwise
- Automatically detects active state by matching `url` against the current pathname
- Shows a left border indicator when active
- Supports hover effects and transitions

## Examples

**Simple menu item:**

```yaml
menu_item:
  icon: solar:notebook-minimalistic-linear
  text: Documentation
  url: /
```

**External link with trailing icon:**

```yaml
menu_item:
  icon: flowbite:google-solid
  text: Google
  url: https://google.com
  trailing_icon: solar:arrow-right-up-linear
```

**Compact inline syntax:**

```yaml
menu_item: { text: Button, url: /components/buttons }
```

## Related

- [Menu Group](menu-group.md) -- Collapsible group containing menu items
- [Sidebar](sidebar.md) -- Parent navigation container
