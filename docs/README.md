# Fluwy Documentation

> **Fluwy** -- Fluid UI Development with YAML Simplicity

Fluwy is a YAML-driven UI framework built on [SvelteKit](https://kit.svelte.dev/) (Svelte 5), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS v4](https://tailwindcss.com/). It enables developers to build dynamic web applications using human-readable YAML configuration files instead of writing UI code directly.

**Current Version:** 0.10.0

---

## Table of Contents

### Getting Started

- [Introduction](introduction.md) -- What is Fluwy, why use it, and who is it for
- [Getting Started](getting-started.md) -- Quick start guide and setup instructions
- [Tutorial: Build a Contacts App](tutorial.md) -- Step-by-step walkthrough building a real application
- [Architecture](architecture.md) -- System architecture with diagrams

### Core Concepts

- [YAML Syntax](concepts/yaml-syntax.md) -- How YAML is used to describe UI in Fluwy
- [Routing](concepts/routing.md) -- Filesystem-based routing and dynamic parameters
- [Context](concepts/context.md) -- Reactive state management, template strings, and data flow
- [Theming](concepts/theming.md) -- Theme system, colors, and styling with Tailwind CSS
- [Plugins](concepts/plugins.md) -- Extending Fluwy with custom plugins

### Components

#### Layout Components

Build application shells with headers, sidebars, navigation, and page structure.

- [Layout Overview](components/layouts/index.md) -- How layouts work and composition patterns
- [`page`](components/layouts/page.md) -- Root page container
- [`header`](components/layouts/header.md) -- Sticky top navigation bar
- [`body`](components/layouts/body.md) -- Main content area with sidebar, aside, header, footer
- [`sidebar`](components/layouts/sidebar.md) -- Responsive navigation sidebar
- [`aside`](components/layouts/aside.md) -- Right-side panel (e.g., table of contents)
- [`footer`](components/layouts/footer.md) -- Page footer
- [`container`](components/layouts/container.md) -- Centered max-width container / container row
- [`brand`](components/layouts/brand.md) -- Logo with light/dark mode support
- [`menu_group`](components/layouts/menu-group.md) -- Collapsible navigation group
- [`menu_item`](components/layouts/menu-item.md) -- Navigation link item
- [`sidebar_toggler`](components/layouts/sidebar-toggler.md) -- Mobile sidebar toggle button
- [`dark_mode_toggler`](components/layouts/dark-mode-toggler.md) -- Light/dark/system theme switcher
- [`spacer`](components/layouts/spacer.md) -- Flexible space filler
- [`table_of_contents`](components/layouts/table-of-contents.md) -- Auto-generated heading navigation
- [`banner`](components/layouts/banner.md) -- Top banner area

#### Form Components

Build forms with inputs, validation, and submission handling.

- [Forms](components/forms.md) -- Form component, state management, and validation
- [Input](components/input.md) -- Input field types, sizes, and configuration
- [Buttons](components/buttons.md) -- Button variants, sizes, colors, and customization

#### Data Display

Format and present data values like dates, emails, and phone numbers.

- [Display Overview](components/displays/index.md) -- Overview and usage in tables
- [`date`](components/displays/date.md) -- Formatted date display
- [`datetime`](components/displays/datetime.md) -- Formatted date and time display
- [`date_from_now`](components/displays/date-from-now.md) -- Relative time (e.g., "2 hours ago")
- [`email`](components/displays/email.md) -- Clickable mailto link
- [`phone`](components/displays/phone.md) -- Clickable tel link
- [Tables](components/tables.md) -- Data tables with server-side pagination

#### Feedback and Overlays

Dialogs, dropdowns, tabs, and other interactive overlays.

- [Dialogs](components/dialogs.md) -- Modal dialogs, confirmations, and forms in dialogs
- [Dropdown](components/dropdown.md) -- Dropdown menus with items, labels, separators, and submenus
- [Tabs](components/tabs.md) -- Tabbed interfaces

#### Typography and Media

Text formatting, icons, and visual elements.

- [Typography](components/typography.md) -- Headings, paragraphs, and text elements
- [Avatar](components/avatar.md) -- User avatar with image and initials fallback
- [Icon](components/icon.md) -- Icons from Iconify (icones.js.org)

#### Sidebar Component

- [Sidebar (standalone)](components/sidebar.md) -- Sidebar navigation (standalone usage)

#### Developer Tools

- [Debug](components/debug.md) -- Debug component for inspecting context data

### Operations

Actions executed in response to events (`on_click`, `on_submit`, etc.).

- [Operations Overview](operations/index.md) -- What operations are, how they work, and how to create custom ones

#### HTTP

- [`get`](operations/get.md) -- Make a GET request
- [`post`](operations/post.md) -- Make a POST request
- [`put`](operations/put.md) -- Make a PUT request
- [`delete`](operations/delete.md) -- Make a DELETE request
- [`load`](operations/load.md) -- Parallel data loading (server-side)

#### Navigation

- [`goto`](operations/goto.md) -- Navigate to a route or external URL
- [`refresh`](operations/refresh.md) -- Refresh a specific component

#### Authentication

- [`set_auth_token`](operations/set-auth-token.md) -- Store an auth token as a cookie
- [`unset_auth_token`](operations/unset-auth-token.md) -- Remove the auth token (logout)
- [`authenticate`](operations/authenticate.md) -- Guard pages and actions requiring authentication

#### Data Manipulation

- [`vars`](operations/vars.md) -- Set context variables
- [`log`](operations/log.md) -- Log messages to the console
- [`context`](operations/context-op.md) -- Retrieve a value from the context
- [`extract`](operations/extract.md) -- Extract specific fields from a result
- [`transform`](operations/transform.md) -- Rename keys in a result
- [`wrap_into`](operations/wrap-into.md) -- Wrap a result under a new key

#### UI Feedback

- [`alert`](operations/alert.md) -- Browser alert dialog
- [`notify`](operations/notify.md) -- Toast notifications
- [`open_dialog`](operations/open-dialog.md) -- Open a modal dialog
- [`close_dialog`](operations/close-dialog.md) -- Close the current dialog
- [`set_mode`](operations/set-mode.md) -- Switch color mode (light/dark/system)

#### Form Operations

- [`set_form_errors`](operations/set-form-errors.md) -- Set validation errors from API response
- [`clear_form_errors`](operations/clear-form-errors.md) -- Clear all form errors

#### Cookies

- [`set_cookie`](operations/set-cookie.md) -- Set browser cookies
- [`unset_cookie`](operations/unset-cookie.md) -- Remove a cookie
- [`remove_cookie`](operations/remove-cookie.md) -- Alias for unset_cookie

#### Flow Control

- [`if` / `else`](operations/if.md) -- Conditional execution in operation chains
- [`sleep`](operations/sleep.md) -- Pause an operation chain
- [`emit`](operations/emit.md) -- Emit custom events for cross-component communication
- [`abort`](operations/abort.md) -- Stop the current operation chain

#### Local Storage

- [`unset_local_storage`](operations/unset-local-storage.md) -- Remove a localStorage item
- [`remove_local_storage`](operations/remove-local-storage.md) -- Alias for unset_local_storage

### Template Controls

Conditional rendering and loops in YAML templates (not operation chains).

- [Conditions](controls/conditions.md) -- Conditional rendering with `if` / `else if` / `else`
- [Loops](controls/loops.md) -- Iteration with `for-of`, `for-in`, ranges, and `times`

---

## Community

- **Discord:** [Join the community](https://discord.gg/cpQGUEvHH7)
- **YouTube:** [Subscribe to the channel](https://youtube.com/@fluwyofficial?si=k5g9EJw18_wzjv5K)
- **GitHub:** [withfluwy/fluwy](https://github.com/withfluwy/fluwy)
- **StackBlitz Starter:** [Try Fluwy online](https://stackblitz.com/github/withfluwy/fluwy-starter?file=app/pages/index.yaml)
