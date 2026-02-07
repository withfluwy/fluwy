# Layout Components

Fluwy provides a comprehensive set of layout components that work together to create responsive, navigable application shells. These components handle page structure, navigation, headers, footers, sidebars, and more.

## Overview

Layout components are typically composed together in layout files (`app/layouts/*.yaml`) that define the overall structure of your pages. Individual pages then reference a layout and provide their content via the `slot` mechanism.

### Component Summary

| Component | YAML Name | Purpose |
|-----------|-----------|---------|
| [Page](#page) | `page` | Root page container |
| [Header](#header) | `header` | Sticky top navigation bar |
| [Body](#body) | `body` | Main content area with optional sidebar, aside, header, footer |
| [Sidebar](#sidebar) | `sidebar` | Responsive navigation sidebar |
| [Aside](#aside) | `aside` | Right-side panel (e.g., table of contents) |
| [Footer](#footer) | `footer` | Page footer |
| [Container](#container) | `container` | Centered max-width container |
| [ContainerRow](#container-row) | `container_row` | Container with horizontal flex layout |
| [Brand](#brand) | `brand` | Logo with light/dark mode support |
| [MenuGroup](#menu-group) | `menu_group` | Collapsible navigation group |
| [MenuItem](#menu-item) | `menu_item` | Navigation link item |
| [SidebarToggler](#sidebar-toggler) | `sidebar_toggler` | Mobile sidebar toggle button |
| [DarkModeToggler](#dark-mode-toggler) | `dark_mode_toggler` | Light/dark/system theme switcher |
| [Spacer](#spacer) | `spacer` | Flexible space filler |
| [TableOfContents](#table-of-contents) | `table_of_contents` | Auto-generated heading navigation |
| [Banner](#banner) | `banner` | Top banner area |

---

## Layout Composition

Layouts are YAML files in `app/layouts/` that define how pages are structured. A page references a layout via its `layout` metadata key. Here are two real layout patterns:

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

A page uses a layout by specifying it in its head:

```yaml
layout: doc
---
h1: My Page Title
p: My page content goes here.
```

---

## Page

The root container for every page. It provides full-screen height and scrolling.

```yaml
page:
  class: # Optional CSS classes
  # Contains header, body, container, footer, etc.
```

**Behavior:**
- Renders with `id="page"` and full viewport height (`h-screen`)
- Automatically detects presence of sidebar and aside, adding `no-sidebar` or `no-aside` CSS classes when they are hidden
- Provides scroll overflow for the entire page

---

## Header

A sticky top navigation bar that stays visible while scrolling.

```yaml
header:
  id: # Optional. Defaults to "header"
  class: # Optional CSS classes
  content:
    - sidebar_toggler:
    - brand: ...
    - spacer:
    - dark_mode_toggler:
```

**Behavior:**
- Sticky positioned at the top (`sticky top-0 z-2`)
- Has a bottom border and backdrop blur for visual separation
- Applies theme colors for background and border
- Content is rendered as flex items

---

## Body

The main content wrapper that organizes header, sidebar, main content, aside, and footer within a page.

```yaml
body:
  header: # Optional. Header component props
  sidebar: # Optional. Sidebar component content
  aside: # Optional. Aside component content
  footer: # Optional. Footer component props
  slot: default  # Where page content goes
```

**Behavior:**
- Arranges its children in a flex row layout
- Sidebar appears on the left, main content in the center, aside on the right
- Main content area (`<main>`) grows to fill available space
- Components (header, sidebar, footer, aside) are conditionally rendered only when provided

---

## Sidebar

Responsive navigation sidebar with mobile overlay support.

```yaml
sidebar:
  class: # Optional CSS classes
  content:
    - brand: ...
    - menu_item: ...
    - menu_group: ...
```

**Behavior:**
- **Desktop** (`lg:` and above): Sticky sidebar always visible, with a vertical indicator bar that tracks the active menu item
- **Mobile** (below `lg:`): Hidden by default; opens as a full-height overlay with a backdrop when triggered by `sidebar_toggler`
- Auto-closes on mobile after navigation
- Uses `MutationObserver` to track which menu item is active and animate the indicator bar
- Calculates dynamic height to account for sticky header

---

## Aside

A right-side panel, typically used for supplementary content like a table of contents.

```yaml
aside:
  class: pt-10 border-0
  table_of_contents:
    max_level: 3
```

**Behavior:**
- Sticky positioned, only visible on extra-large screens (`xl:block`)
- Fixed width (`w-64`) with full viewport height
- Scrollable content area
- Hidden on mobile and tablet

---

## Footer

Page footer area.

```yaml
footer:
  class: # Optional CSS classes
  content: # Footer content
```

---

## Container

A centered, max-width container using Tailwind's `container` utility.

```yaml
container:
  class: # Optional additional CSS classes
  content: # Nested content
```

**Example:**

```yaml
container:
  class: py-8
  content:
    - h1: Welcome
    - p: This content is centered with a max width.
```

---

## Container Row

A container with a horizontal flex layout, useful for header content.

```yaml
container_row:
  - sidebar_toggler:
  - brand: ...
  - spacer:
  - dark_mode_toggler:
```

**Behavior:**
- Combines Tailwind's `container` with `flex items-center gap-3`
- Content items are arranged horizontally with centered alignment

---

## Brand

A logo component with light/dark mode image switching.

```yaml
brand:
  light: /logo-black.svg   # Required. Image URL for light mode
  dark: /logo-white.svg    # Optional. Image URL for dark mode (defaults to light)
  url: /                   # Required. Link destination when clicked
  class: # Optional CSS classes
```

**Example:**

```yaml
brand:
  class: mx-4 my-3
  light: /fluwy-logo-black.svg
  dark: /fluwy-logo-white.svg
  url: /
```

---

## Menu Group

A collapsible navigation group that contains menu items. Automatically highlights when any child route is active.

```yaml
menu_group:
  header: # Required. Group label text
  icon: # Optional. Icon from icones.js.org
  trailing_icon: # Optional. Defaults to a chevron arrow
  active_if_starts_with: # Optional. URL prefix for active state detection
  content:
    - menu_item: ...
    - menu_item: ...
```

**Behavior:**
- Renders as a collapsible section (open by default)
- Trailing icon rotates 90 degrees when expanded
- Active state is determined by matching the current URL against `active_if_starts_with`
- Supports nested `menu_group` components for multi-level navigation

**Example:**

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

---

## Menu Item

A navigation link that highlights when its URL matches the current page.

```yaml
menu_item:
  text: # Optional. Label text
  url: # Optional. Link destination
  icon: # Optional. Leading icon
  trailing_icon: # Optional. Trailing icon
  class: # Optional CSS classes
  content: # Optional. Alternative to text for custom content
```

**Behavior:**
- Renders as an `<a>` tag when `url` is provided, or a `<div>` otherwise
- Automatically detects active state by matching `url` against the current pathname
- Shows a left border indicator when active
- Supports hover effects and transitions

**Examples:**

```yaml
# Simple menu item
menu_item:
  icon: solar:notebook-minimalistic-linear
  text: Documentation
  url: /

# External link with trailing icon
menu_item:
  icon: flowbite:google-solid
  text: Google
  url: https://google.com
  trailing_icon: solar:arrow-right-up-linear

# Compact inline syntax
menu_item: { text: Button, url: /components/buttons }
```

---

## Sidebar Toggler

A button that opens/closes the mobile sidebar. Only visible on mobile screens.

```yaml
sidebar_toggler:
  icon: # Optional. Defaults to bars icon
  color: # Optional. Button color
  class: # Optional CSS classes
```

**Behavior:**
- Emits a `ToggleSidebar` event on click
- Hidden on desktop screens (`lg:hidden`)
- Uses ghost button variant by default

---

## Dark Mode Toggler

A dropdown button that lets users switch between light, dark, and system color modes.

```yaml
dark_mode_toggler:
  align: end  # Optional. Dropdown alignment
```

**Behavior:**
- Displays a sun, moon, or contrast icon based on the current mode
- Opens a dropdown with three options: Light, Dark, System
- Active mode is highlighted with `text-primary`
- Uses the `set_mode` operation to change themes

---

## Spacer

A flexible space filler for flex layouts. Pushes surrounding content apart.

```yaml
spacer:
```

Or with custom classes:

```yaml
spacer: mt-4
```

**Behavior:**
- Renders a `<div>` with `flex-1` to fill available space in flex containers
- Commonly used in headers between left and right content groups

---

## Table of Contents

An auto-generated navigation component that tracks headings on the page.

```yaml
table_of_contents:
  max_level: 3              # Optional. Maximum heading depth (e.g., 3 = h1-h3)
  selector: "#content"      # Optional. CSS selector for the content area to scan
  class: # Optional CSS classes
```

**Behavior:**
- Scans the DOM for headings within the specified selector
- Builds a hierarchical list of links
- Uses `IntersectionObserver` to highlight the currently visible heading
- Smooth-scrolls to headings on click, accounting for sticky header offset
- Re-initializes on navigation events and content changes
- Filters headings by `max_level` when specified

**Example (in a layout aside):**

```yaml
aside:
  class: pt-10 border-0
  table_of_contents:
    max_level: 3
    selector: "#content, .doc-content"
```

---

## Banner

A simple top banner container.

```yaml
banner:
  class: # Optional CSS classes
  content: # Banner content
```

**Behavior:**
- Renders a `<div>` with `id="banner"`
- Useful for announcements or notices at the very top of the page
