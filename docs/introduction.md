# Introduction

> Fluid UI Development with YAML Simplicity

Welcome to Fluwy -- a complete App UI Framework that lets you build dynamic, elegant web applications using human-readable YAML files. Define layouts, behaviors, and themes without writing UI code. Connect to any RESTful API. Ship faster.

## What is Fluwy?

Fluwy is a YAML-driven UI framework built on SvelteKit (Svelte 5), TypeScript, and Tailwind CSS v4. Instead of writing Svelte components for every page, you describe your UI in YAML configuration files. Fluwy compiles those files into a fully interactive web application at runtime.

Here's what a complete page looks like:

```yaml
layout: dashboard
server:
  authenticate:
    redirect: /login
  load:
    contacts: https://api.example.com/contacts
---
h1: Contacts
table:
  data: contacts
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}
```

That's it -- a protected page with server-side data loading and a formatted table, all in 14 lines of YAML.

## Key Features

- **YAML Configuration** -- Define pages, layouts, forms, tables, and interactions using straightforward YAML. No JSX, no template syntax to learn.
- **Zero Downtime Updates** -- Save your YAML file and refresh the page. No rebuilds, no restarts, no redeployments for UI changes.
- **Themeable Design System** -- Customize your application's appearance with theme files that apply TailwindCSS classes consistently across components.
- **API Agnostic** -- Connect to any RESTful API -- your own backend, PayloadCMS, Strapi, or multiple microservices at once.
- **Extensible Plugin System** -- Add custom components, operations, and integrations through a clean plugin interface.
- **Full SvelteKit Power** -- When YAML isn't enough, drop down to Svelte components. Fluwy doesn't lock you in.

## Who is Fluwy For?

### Developers and Solopreneurs

Rapidly build UI applications connected to backend APIs without starting from scratch. Fluwy handles the UI layer so you can focus on business logic.

### Designers

Create functional applications without deep programming involvement. With YAML and TailwindCSS, you can focus on the visual experience and iterate quickly.

### Teams and Enterprises

Centralize web product development using a shared design system. Fluwy provides a single source of truth for UI patterns, making collaborative work consistent across projects.

## Origin of the Name

The name **"Fluwy"** blends three words: **Fluent**, **Flow**, and **Fluid**. It represents a commitment to making UI development as seamless and intuitive as possible.

## Join the Community

- **Discord**: [Join our community](https://discord.gg/cpQGUEvHH7)
- **YouTube**: [Subscribe to our channel](https://youtube.com/@fluwyofficial?si=k5g9EJw18_wzjv5K)
- **GitHub**: [withfluwy/fluwy](https://github.com/withfluwy/fluwy)

---

Ready to start building? Head to the [Getting Started](getting-started.md) guide, or jump straight into the [Tutorial](tutorial.md) to build a complete contacts app.
