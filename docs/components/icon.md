# Icon

The icon component renders icons from the [Iconify](https://iconify.design/) library. You can browse all available icons at [icones.js.org](https://icones.js.org/).

## Basic Usage

```yaml
icon: solar:home-linear
```

Or with explicit properties:

```yaml
icon:
  name: solar:home-linear
  size: 24
```

## Properties

```yaml
icon:
  name: # string -- Icon name from Iconify (e.g., "solar:home-linear")
  size: # number -- Height in pixels. Defaults to theme common.icon_size or 20
  color: # string -- Color name from palette (e.g., "primary" becomes var(--color-primary))
  class: # string -- Additional CSS classes
  content: # string -- Alternative to name for specifying the icon
```

## Icon Names

Icons use the format `collection:icon-name`. Some popular collections:

| Collection | Example | Style |
|-----------|---------|-------|
| `solar` | `solar:home-linear` | Linear, clean icons |
| `mdi` | `mdi:github` | Material Design |
| `ph` | `ph:x-bold` | Phosphor icons |
| `flowbite` | `flowbite:google-solid` | Flowbite icons |
| `gravity-ui` | `gravity-ui:bars` | Gravity UI icons |

Browse the full collection at [icones.js.org](https://icones.js.org/).

## Size

```yaml
# Default size (20px)
icon: solar:home-linear

# Custom size
icon:
  name: solar:home-linear
  size: 32
```

The default icon size can be configured in your theme:

```yaml
common:
  icon_size: 20
```

## Color

```yaml
icon:
  name: solar:heart-linear
  color: primary       # Uses var(--color-primary)
```

Or use Tailwind classes:

```yaml
icon:
  name: solar:heart-linear
  class: text-red-500
```

## Usage in Other Components

Icons are commonly used within buttons, menu items, and other components:

```yaml
# Button with icon
button:
  text: Settings
  icon: solar:settings-linear

# Button with custom icon size
button:
  text: Large Icon
  icon:
    name: solar:heart-linear
    size: 26

# Menu item with icon
menu_item:
  icon: solar:notebook-minimalistic-linear
  text: Documentation
  url: /
```

When used as a prop in components like `button`, you can pass either a simple string (icon name) or an object with `name` and `size` properties.
