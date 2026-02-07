# Layout Components

Fluwy provides a comprehensive set of layout components that work together to create responsive, navigable application shells. These components handle page structure, navigation, headers, footers, sidebars, and more.

## Overview

Layout components are typically composed together in layout files (`app/layouts/*.yaml`) that define the overall structure of your pages. Individual pages then reference a layout and provide their content via the `slot` mechanism.

### Component Summary

| Component | YAML Name | Purpose |
|-----------|-----------|---------|
| [Page](page.md) | `page` | Root page container |
| [Header](header.md) | `header` | Sticky top navigation bar |
| [Body](body.md) | `body` | Main content area with optional sidebar, aside, header, footer |
| [Sidebar](sidebar.md) | `sidebar` | Responsive navigation sidebar |
| [Aside](aside.md) | `aside` | Right-side panel (e.g., table of contents) |
| [Footer](footer.md) | `footer` | Page footer |
| [Container](container.md) | `container` / `container_row` | Centered max-width container |
| [Brand](brand.md) | `brand` | Logo with light/dark mode support |
| [Menu Group](menu-group.md) | `menu_group` | Collapsible navigation group |
| [Menu Item](menu-item.md) | `menu_item` | Navigation link item |
| [Sidebar Toggler](sidebar-toggler.md) | `sidebar_toggler` | Mobile sidebar toggle button |
| [Dark Mode Toggler](dark-mode-toggler.md) | `dark_mode_toggler` | Light/dark/system theme switcher |
| [Spacer](spacer.md) | `spacer` | Flexible space filler |
| [Table of Contents](table-of-contents.md) | `table_of_contents` | Auto-generated heading navigation |
| [Banner](banner.md) | `banner` | Top banner area |

---

## Layout Composition

Layouts are YAML files in `app/layouts/` that define how pages are structured. A page references a layout via its `layout` metadata key.

### Documentation Layout

A layout with a header, sidebar navigation, main content, and an aside panel for a table of contents:

```yaml
# app/layouts/doc.yaml
theme: doc
---
page:
  header:
    class: px-0 sm:px-4
    container_row:
      - sidebar_toggler:
      - brand:
          light: /fluwy-logo-black.svg
          dark: /fluwy-logo-white.svg
          url: /
      - spacer:
      - dark_mode_toggler:
  container:
    body:
      sidebar:
        - menu_item:
            icon: solar:hand-stars-line-duotone
            text: Introduction
            url: /
        - menu_group:
            header: Components
            active_if_starts_with: /components
            icon: solar:three-squares-line-duotone
            content:
              - menu_item: { text: Button, url: /components/buttons }
              - menu_item: { text: Dialog, url: /components/dialogs }
      aside:
        class: pt-10 border-0
        table_of_contents:
          max_level: 3
          selector: "#content, .doc-content"
      slot: default
```

### Dashboard Layout

A layout with the sidebar containing the brand, and the header across the top:

```yaml
# app/layouts/dashboard.yaml
theme: default
---
page:
  body:
    header:
      content:
        - sidebar_toggler:
        - spacer:
        - dark_mode_toggler:
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
    slot: default
```

### Using a Layout in a Page

A page uses a layout by specifying it in its head section:

```yaml
layout: doc
---
h1: My Page Title
p: My page content goes here.
```
