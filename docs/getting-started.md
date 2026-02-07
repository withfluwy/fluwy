# Getting Started

Welcome to the **Getting Started** guide for **Fluwy**! This guide will help you set up your environment and create your first application using Fluwy's human-friendly YAML configuration files. Let's dive in and see how Fluwy simplifies UI development for everyone.

## The Fastest Way to Start: Use the Fluwy StackBlitz Starter

The quickest way to start building with Fluwy is by using the StackBlitz project we've set up for you. This online editor lets you experiment with Fluwy right in your browser -- no installation required.

**[Open the Fluwy Starter Project](https://stackblitz.com/github/withfluwy/fluwy-starter?file=app/pages/index.yaml)**

Click the link above to launch the Fluwy Starter project on StackBlitz. Or if you are a developer with Node.js installed, you can start with the template using `degit`:

```bash
pnpx degit withfluwy/fluwy-starter my-app
```

## Project Structure

Once you have a Fluwy project set up, you'll see a structure like this:

```
my-app/
  app/
    pages/        # Your page files (YAML)
    layouts/      # Layout definitions (YAML)
    themes/       # Theme files (YAML)
  src/
    lib/          # Your custom components and plugins
    routes/       # SvelteKit routes (auto-handled)
  static/         # Static assets
  package.json    # Dependencies
```

The key directories are inside `app/`:

- **`pages/`** -- Each `.yaml` file becomes a route. The file structure mirrors your URL structure.
- **`layouts/`** -- Reusable layout templates that pages can reference.
- **`themes/`** -- Theme files with TailwindCSS classes for consistent styling.

## Your First Page

Create a file at `app/pages/index.yaml`:

```yaml
h1: Hello, Fluwy!
p: Welcome to your first Fluwy application.
button:
  text: Click me!
  color: primary
  on_click:
    alert: You clicked the button!
```

Save the file and your page will instantly appear at `/` -- no rebuild required.

## Next Steps

- **[Introduction](introduction.md)** -- Learn what Fluwy is and its core philosophy
- **[YAML Syntax](concepts/yaml-syntax.md)** -- Understand how YAML maps to UI components
- **[Routing](concepts/routing.md)** -- Learn about filesystem-based routing
- **[Theming](concepts/theming.md)** -- Customize the look and feel
- **[Components](components/buttons.md)** -- Explore available components
- **[Operations](operations/index.md)** -- Learn about event-driven operations

## Join the Community

We're building Fluwy together with our community on Discord and YouTube. Join us to follow the development process, contribute ideas, and stay updated on the latest features.

- **Discord**: [Join our community](https://discord.gg/cpQGUEvHH7)
- **YouTube**: [Subscribe to our channel](https://youtube.com/@fluwyofficial?si=k5g9EJw18_wzjv5K)

---

Thank you for being part of the Fluwy journey. Together, we're making UI development more accessible, efficient, and enjoyable for everyone!
