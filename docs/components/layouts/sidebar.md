# sidebar

Responsive navigation sidebar with mobile overlay support. On desktop, it's always visible as a sticky sidebar. On mobile, it's hidden and opens as a full-height overlay when triggered.

## Basic Usage

```yaml
sidebar:
  content:
    - brand:
        light: /logo.svg
        url: /
    - menu_item: { text: Home, url: / }
    - menu_group:
        header: Settings
        content:
          - menu_item: { text: Profile, url: /settings/profile }
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `class` | string | Optional CSS classes |
| `content` | Components | Sidebar content (menu items, groups, brand, etc.) |

## Behavior

- **Desktop** (`lg:` and above): Sticky sidebar always visible, with a vertical indicator bar that tracks the active menu item
- **Mobile** (below `lg:`): Hidden by default; opens as a full-height overlay with a backdrop when triggered by `sidebar_toggler`
- Auto-closes on mobile after navigation
- Uses `MutationObserver` to track which menu item is active and animate the indicator bar
- Calculates dynamic height to account for sticky header

## Examples

**Sidebar with brand and navigation:**

```yaml
sidebar:
  content:
    - brand:
        class: mx-4 my-3
        light: /fluwy-logo-black.svg
        dark: /fluwy-logo-white.svg
        url: /
    - menu_item:
        icon: solar:notebook-minimalistic-linear
        text: Documentation
        url: /
    - menu_group:
        header: Settings
        icon: solar:settings-bold-duotone
        active_if_starts_with: /settings
        content:
          - menu_item: { text: Overview, url: /settings }
```

**Sidebar with simple menu items:**

```yaml
sidebar:
  - menu_item:
      icon: solar:hand-stars-line-duotone
      text: Introduction
      url: /
  - menu_item:
      icon: solar:document-text-linear
      text: Getting Started
      url: /getting-started
```

## Related

- [Sidebar Toggler](sidebar-toggler.md) -- Toggle button for mobile
- [Menu Group](menu-group.md) -- Collapsible menu sections
- [Menu Item](menu-item.md) -- Navigation links
- [Body](body.md) -- Parent wrapper component
