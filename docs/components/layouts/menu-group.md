# menu_group

A collapsible navigation group that contains menu items. Automatically highlights when any child route is active.

## Basic Usage

```yaml
menu_group:
  header: Components
  icon: solar:three-squares-line-duotone
  active_if_starts_with: /components
  content:
    - menu_item: { text: Button, url: /components/buttons }
    - menu_item: { text: Dialog, url: /components/dialogs }
    - menu_item: { text: Tables, url: /components/tables }
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header` | string | -- | **Required.** Group label text |
| `icon` | string | -- | Optional. Icon from [icones.js.org](https://icones.js.org) |
| `trailing_icon` | string | Chevron arrow | Optional. Icon on the right side |
| `active_if_starts_with` | string | -- | Optional. URL prefix for active state detection |
| `content` | Components | -- | Child menu items or nested groups |

## Behavior

- Renders as a collapsible section (open by default)
- Trailing icon rotates 90 degrees when expanded
- Active state is determined by matching the current URL against `active_if_starts_with`
- Supports nested `menu_group` components for multi-level navigation

## Examples

**Multi-level navigation:**

```yaml
menu_group:
  header: Settings
  icon: solar:settings-bold-duotone
  active_if_starts_with: /settings
  content:
    - menu_item: { text: General, url: /settings/general }
    - menu_item: { text: Security, url: /settings/security }
    - menu_group:
        header: Advanced
        content:
          - menu_item: { text: API Keys, url: /settings/api-keys }
```

## Related

- [Menu Item](menu-item.md) -- Individual navigation links
- [Sidebar](sidebar.md) -- Parent component
