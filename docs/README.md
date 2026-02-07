# Fluwy Documentation

> **Fluwy** -- Fluid UI Development with YAML Simplicity

Fluwy is a YAML-driven UI framework built on [SvelteKit](https://kit.svelte.dev/) (Svelte 5), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS v4](https://tailwindcss.com/). It enables developers to build dynamic web applications using human-readable YAML configuration files instead of writing UI code directly.

**Current Version:** 0.10.0

---

## Table of Contents

### Getting Started

- [Introduction](introduction.md) -- What is Fluwy, why use it, and who is it for
- [Getting Started](getting-started.md) -- Quick start guide and setup instructions
- [Architecture](architecture.md) -- System architecture with diagrams

### Core Concepts

- [YAML Syntax](concepts/yaml-syntax.md) -- How YAML is used to describe UI in Fluwy
- [Routing](concepts/routing.md) -- Filesystem-based routing and dynamic parameters
- [Theming](concepts/theming.md) -- Theme system, colors, and styling with Tailwind CSS
- [Plugins](concepts/plugins.md) -- Extending Fluwy with custom plugins

### Components

- [Buttons](components/buttons.md) -- Button variants, sizes, colors, and customization
- [Dialogs](components/dialogs.md) -- Modal dialogs, confirmations, and forms in dialogs
- [Forms](components/forms.md) -- Form component, state management, and validation
- [Input](components/input.md) -- Input field types, sizes, and configuration
- [Tables](components/tables.md) -- Data tables with server-side pagination
- [Tabs](components/tabs.md) -- Tabbed interfaces
- [Typography](components/typography.md) -- Headings, paragraphs, and text elements
- [Sidebar](components/sidebar.md) -- Sidebar navigation (coming soon)
- [Dropdown](components/dropdown.md) -- Dropdown menus (coming soon)

### Operations

- [Operations Overview](operations/index.md) -- What operations are and how they work
- [HTTP Operations](operations/http.md) -- GET, POST, PUT, DELETE, and load operations
- [Navigation](operations/navigation.md) -- Page navigation with `goto`
- [Authentication](operations/auth.md) -- Token management with `set_auth_token` / `unset_auth_token`
- [Cookies](operations/cookies.md) -- Cookie management with `set_cookie` / `unset_cookie`
- [Form Operations](operations/form-operations.md) -- Form error handling operations

### Controls

- [Conditions](controls/conditions.md) -- Conditional rendering with `if` / `else if` / `else`
- [Loops](controls/loops.md) -- Iteration with `for-of`, `for-in`, ranges, and `times`

---

## Community

- **Discord:** [Join the community](https://discord.gg/cpQGUEvHH7)
- **YouTube:** [Subscribe to the channel](https://youtube.com/@fluwyofficial?si=k5g9EJw18_wzjv5K)
- **GitHub:** [withfluwy/fluwy](https://github.com/withfluwy/fluwy)
- **StackBlitz Starter:** [Try Fluwy online](https://stackblitz.com/github/withfluwy/fluwy-starter?file=app/pages/index.yaml)
