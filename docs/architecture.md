# Architecture

This document describes the internal architecture of Fluwy, how its systems connect, and how YAML files are transformed into rendered web pages.

## System Overview

Fluwy sits on top of SvelteKit and transforms YAML configuration files into a fully interactive web application at runtime.

```mermaid
graph TD
    Browser[Browser Request] --> SvelteKit[SvelteKit Router]
    SvelteKit --> CatchAll["Catch-all Route ([...path])"]
    CatchAll --> RouteResolver[Route Resolver]
    RouteResolver --> YAMLLoader[YAML File Loader]
    YAMLLoader --> DocumentParser[Document Parser]
    DocumentParser --> LayoutMerger[Layout Merger]
    LayoutMerger --> ServerOps[Server Operations]
    ServerOps --> TemplateCompiler[Template Compiler]
    TemplateCompiler --> ComponentNormalizer[Component Normalizer]
    ComponentNormalizer --> SvelteRenderer["Render.svelte (Recursive)"]
    SvelteRenderer --> RenderedPage[Rendered Page]
```

## Core Architecture

The `Application` class is the central hub that ties everything together. It holds the component registry, operations registry, adapters, and plugin system.

```mermaid
classDiagram
    class Application {
        +components: Record~string, Component~
        +operations: OperationHandlers
        +adapters: Adapters
        +config: AppConfig
        +register(name, component)
        +registerAll(components)
        +plug(plugin)
        +render(document)
    }

    class Context {
        +data: SvelteStore
        +set(key, value)
        +get(key)
        +cloneWith(data)
    }

    class Route {
        +path: string
        +params: Record
        +findRoute(path)
        +extractParams(path)
    }

    Application --> Context : manages
    Application --> Route : resolves
```

## Component Hierarchy

Fluwy organizes its components into six categories, all registered at startup via `createApp()`:

```mermaid
graph TD
    createApp["createApp()"] --> Forms
    createApp --> Primitives
    createApp --> Controls
    createApp --> Layouts
    createApp --> Common
    createApp --> Displays

    subgraph Forms[Forms]
        button[button]
        input[input]
        form[form]
        checkbox[checkbox]
    end

    subgraph Primitives[Primitives]
        div[div]
        h1h6["h1 - h6"]
        p[p]
        text[text]
        row[row]
        column[column]
        link[link]
        image[image]
        markdown[markdown]
        code[code]
        b[b]
    end

    subgraph Controls[Controls]
        condition["condition (if/else)"]
        forEach["for_each (for-of)"]
        loop["loop (times)"]
    end

    subgraph Layouts[Layouts]
        page[page]
        header[header]
        sidebar[sidebar]
        footer[footer]
        container[container]
        body[body]
        menuGroup[menu_group]
        menuItem[menu_item]
        spacer[spacer]
    end

    subgraph Common[Common]
        dialog[dialog]
        dropdown[dropdown]
        tabs[tabs]
        tab[tab]
        icon[icon]
        avatar[avatar]
    end

    subgraph Displays[Displays]
        table[table]
        pagination[pagination]
        date[date]
        dateFromNow[date_from_now]
        email[email]
        phone[phone]
    end
```

## Rendering Pipeline

This is the step-by-step flow from a browser request to rendered HTML:

```mermaid
sequenceDiagram
    participant Browser
    participant SvelteKit
    participant PageServer as +page.server.ts
    participant App as Application
    participant Render as Render.svelte

    Browser->>SvelteKit: GET /contacts
    SvelteKit->>PageServer: Load route [...path]
    PageServer->>App: findRoute("/contacts")
    App-->>PageServer: app/pages/contacts/index.yaml
    PageServer->>App: getDocument(yamlContent)
    Note over App: Split by --- separator
    Note over App: Head = metadata (layout, theme, server)
    Note over App: Body = page content
    PageServer->>App: Load layout (if specified)
    Note over App: Merge layout head with page head
    Note over App: Replace layout "slot" with page body
    PageServer->>App: runServerOperations()
    Note over App: Execute server-side load, get, vars
    PageServer-->>SvelteKit: Return compiled document + context
    SvelteKit->>Render: Render page with context
    Note over Render: normalizeToComponents(body)
    Note over Render: For each component, lookup in registry
    Note over Render: Render recursively with props
    Render-->>Browser: HTML + Interactive Svelte
```

### YAML Document Structure

Every YAML page file follows this structure:

```yaml
# Head section (metadata)
layout: doc          # Which layout to use
theme: my-theme      # Which theme to apply
server:              # Server-side operations
  load:
    contact: https://api.example.com/contacts/${params.id}
---
# Body section (page content)
h1: Contact Page
p: ${contact.name}
```

The `---` separator divides the head (metadata) from the body (UI content).

## Operation Execution Flow

Operations are functions executed in sequence in response to events (clicks, form submissions, page loads, etc.):

```mermaid
sequenceDiagram
    participant User
    participant Component as Button/Form
    participant OpRunner as Operation Runner
    participant OpHandler as Operation Handler
    participant Ctx as Context

    User->>Component: Click / Submit
    Component->>OpRunner: Execute on_click / on_submit
    loop For each operation in chain
        OpRunner->>OpHandler: Execute operation(params, options)
        OpHandler->>Ctx: Read/write context
        Ctx-->>OpHandler: Updated state
        OpHandler-->>OpRunner: Result (or AbortOperation)
    end
    OpRunner-->>Component: Chain complete
    Component-->>User: UI updates reactively
```

### Built-in Operations

| Category       | Operations                                              |
|---------------|--------------------------------------------------------|
| HTTP          | `get`, `post`, `put`, `delete`, `load`                 |
| Navigation    | `goto`, `refresh`                                       |
| Auth          | `set_auth_token`, `unset_auth_token`, `authenticate`   |
| Forms         | `set_form_errors`, `clear_form_errors`                 |
| UI            | `open_dialog`, `close_dialog`, `notify`, `alert`       |
| Data          | `vars`, `log`, `extract`, `transform`                  |
| Cookies       | `set_cookie`, `remove_cookie`                          |
| Control       | `if`, `sleep`, `emit`, `abort`                         |

## Context and State Management

The `Context` object is a reactive store (powered by Svelte stores) that flows through the entire component tree. It is available on both server and client.

```mermaid
graph TD
    PageContext[Page Context] --> RouteParams["params (route parameters)"]
    PageContext --> AuthToken["auth_token (from cookies)"]
    PageContext --> ServerData["Server-loaded data (vars)"]
    PageContext --> FormContext[Form Context]

    FormContext --> FormData["form.data"]
    FormContext --> FormErrors["form.errors"]
    FormContext --> FormSubmitting["form.submitting"]
    FormContext --> FormPristine["form.pristine"]

    PageContext --> OperationContext[Operation Context]
    OperationContext --> ResponseData["response.data"]
    OperationContext --> ResponseStatus["response.status"]
```

Components access context using `useContext()`, and operations can read/write context values. Template strings like `${contact.name}` are resolved against the current context.

## Plugin System

Plugins extend Fluwy with new components, operations, and sub-plugins. They follow a namespaced registration pattern:

```mermaid
graph LR
    AppPlugin["app.plug(plugin)"] --> Registration
    Registration --> RegComponents["Register components as plugin_name.component_name"]
    Registration --> RegOperations["Register operations as plugin_name.operation_name"]
    Registration --> RegSubPlugins["Register sub-plugins recursively"]

    subgraph usage[Usage in YAML]
        YAMLComponent["my_plugin.custom_component:"]
        YAMLOperation["my_plugin.custom_operation:"]
    end

    RegComponents --> YAMLComponent
    RegOperations --> YAMLOperation
```

### Plugin Interface

```typescript
interface Plugin {
  name: string;                              // snake_case plugin name
  operations?: Record<string, Operation>;    // Custom operations
  components?: Record<string, SvelteComponent>; // Custom Svelte components
  plugins?: Plugin[];                        // Sub-plugins
}
```

## Theming Flow

Themes are YAML files containing TailwindCSS classes. They are applied per-page or per-layout:

```mermaid
graph TD
    ThemeFile["app/themes/my-theme.yaml"] --> ThemeParser[Theme Parser]
    PageHead["Page head: theme: my-theme"] --> ThemeParser
    ThemeParser --> ThemeMerge["mergeThemes() with tailwind-merge"]
    ThemeMerge --> CSSVars["generateColorVariables()"]
    CSSVars --> DocumentBody["Applied to document.body.style"]

    ThemeMerge --> ComponentTheme["useTheme() hook"]
    ComponentTheme --> ComponentStyle["Component renders with merged classes"]

    ComponentClass["Component class prop (highest priority)"] --> ComponentStyle
```

### Theme File Structure

```yaml
# app/themes/my-theme.yaml
colors:
  primary:
    DEFAULT: "#3b82f6"
    50: "#eff6ff"
    # ... 100-950

common:
  border_color: "border-blue-500"
  border_radius:
    sm: "rounded"
    md: "rounded-md"
    lg: "rounded-lg"

forms:
  button:
    variants:
      default: "bg-neutral-100 text-neutral-900"
      filled: "bg-color-500 text-white"
      outline: "border border-color-500 text-color-500"
      ghost: "text-color-500 hover:bg-color-50"
      link: "text-color-500 underline"

displays:
  table:
    header:
    row:
      default:
      clickable:
    pagination:
      wrapper:
```

## Key Source Files

| File | Purpose |
|------|---------|
| `src/lib/index.ts` | Main library entry, `createApp()`, component registration |
| `src/lib/core/app/index.ts` | `Application` class with registries |
| `src/lib/core/render.svelte` | Recursive component renderer |
| `src/lib/core/router/route.ts` | Filesystem-based route resolution |
| `src/lib/core/context/index.ts` | Reactive state management (Context) |
| `src/lib/core/operations/index.ts` | Operation system and built-in ops |
| `src/lib/core/utils/normalizers/normalize-to-components.ts` | YAML to component schema normalization |
| `src/routes/[...path]/+page.server.ts` | SvelteKit server-side route handler |
| `src/routes/[...path]/+page.svelte` | SvelteKit page wrapper component |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (Svelte 5) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |
| Package Manager | pnpm |
| UI Primitives | bits-ui |
| Markdown | marked |
| YAML Parsing | yaml |
| Icons | iconify-icon (icones.js.org) |
| Date Handling | dayjs |
| Toasts | svelte-sonner |
