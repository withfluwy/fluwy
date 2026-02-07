# Sidebar

The sidebar component provides responsive navigation for your application. It appears as a persistent panel on desktop and as a toggleable overlay on mobile.

For full documentation on how the sidebar works together with other layout components, see the [Layout Components](layouts/index.md) guide.

## Basic Usage

```yaml
sidebar:
  content:
    - brand:
        light: /logo-black.svg
        dark: /logo-white.svg
        url: /
    - menu_item:
        icon: solar:home-linear
        text: Home
        url: /
    - menu_group:
        header: Settings
        icon: solar:settings-linear
        active_if_starts_with: /settings
        content:
          - menu_item: { text: General, url: /settings }
          - menu_item: { text: Profile, url: /settings/profile }
```

## Properties

```yaml
sidebar:
  class: # Optional CSS classes
  content: # Sidebar content (menu items, groups, brand, etc.)
```

## Behavior

- **Desktop** (`lg:` and above): Always visible as a sticky panel on the left side
- **Mobile** (below `lg:`): Hidden by default; opens as a full-height overlay when triggered by [`sidebar_toggler`](layouts/sidebar-toggler.md)
- Automatically closes on mobile after navigation
- Features an animated indicator bar that tracks the currently active menu item

## Related Components

These components are commonly used inside a sidebar:

- [`brand`](layouts/brand.md) -- Logo with light/dark mode support
- [`menu_item`](layouts/menu-item.md) -- Navigation link with active state
- [`menu_group`](layouts/menu-group.md) -- Collapsible group of menu items
- [`sidebar_toggler`](layouts/sidebar-toggler.md) -- Mobile toggle button (placed in the header)

See [Layout Components](layouts/index.md) for detailed documentation on each of these components and complete layout composition examples.

## Related

- [Layout Components](layouts/index.md) -- Full layout composition guide
- [`sidebar` (layout)](layouts/sidebar.md) -- Sidebar as a layout component
- [`menu_group`](layouts/menu-group.md) -- Collapsible navigation groups
- [`menu_item`](layouts/menu-item.md) -- Navigation link items
