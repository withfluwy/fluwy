# set_mode

Changes the application color mode (light, dark, or system) using [mode-watcher](https://github.com/svecosystem/mode-watcher). Use this when you need custom mode-switching UI beyond the built-in `dark_mode_toggler` component.

## Structure

```yaml
set_mode: "light" | "dark" | "system"
```

## Examples

**Dark mode button:**

```yaml
button:
  text: Dark Mode
  icon: solar:moon-linear
  on_click:
    set_mode: dark
```

**Light mode button:**

```yaml
button:
  text: Light Mode
  icon: solar:sun-linear
  on_click:
    set_mode: light
```

**Follow system preference:**

```yaml
button:
  text: System
  icon: solar:monitor-linear
  on_click:
    set_mode: system
```

> **Tip:** The built-in [`dark_mode_toggler`](../components/layouts/dark-mode-toggler.md) layout component already provides a dropdown with all three mode options. Use `set_mode` only when you need a custom mode-switching UI.

## Availability

Client-side only.

## Related

- [Dark Mode Toggler](../components/layouts/dark-mode-toggler.md) -- Built-in theme switcher component
