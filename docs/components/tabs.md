# Tabs

Tabs can be used to create a tabbed interface to switch between different views.

## Basic Usage

```yaml
tabs:
  - tab:
      title: "Tab 1"
      panel: "Content of tab 1"
  - tab:
      title: "Tab 2"
      panel: "Content of tab 2"
```

## Properties

### Minimum Structure

```yaml
tabs:
  - tab:
      title: # required -- Tab label text or template
      panel: # required -- Tab content
```

### All Properties

```yaml
tabs:
  - tab:
      id: # optional, auto generated
      class: # CSS classes applied to the tab
      outer_radius: # boolean -- Controls outer border radius
      title:
        class: # CSS classes for the tab trigger
        content: # Tab label content
      panel:
        class: # CSS classes for the panel
        content: # Panel content
```

## Custom Tabs

You can customize the tabs by using Tailwind classes on the `title` and `panel` properties or in the tab's `class` property. Both the `title` and `panel` properties inherit the tab's `class` property.

```yaml
tabs:
  - tab:
      class: rounded-[20px] border mb-2
      outer_radius: off
      title:
        class: bg-primary dark:bg-primary text-primary-contrast
        content: Tab 1
      panel:
        content: Content of tab 1
  - tab:
      class: rounded-[20px] border mb-2
      outer_radius: off
      title:
        class: bg-red-500 dark:bg-red-500 data-[state=active]:text-white
        content: Tab 2
      panel: Content of tab 2
```

## Theme Settings

You can customize the tabs by using theme variables:

```yaml
common:
  tab:
    class:
    outer_radius: # defaults to true
    title:
    panel:
    root:
    list:
```

## Related

- [Layout Components](layouts/index.md) -- Page structure components
- [Theming](../concepts/theming.md) -- Customizing tab appearance
