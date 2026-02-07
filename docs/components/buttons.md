# Buttons

Buttons are really simple to use and super customizable in Fluwy. They come with a set of predefined variants, but you can easily add more variants with your theme file. They also support all the colors defined in your palette, and you can also create variants that support all the colors you have.

## Basic Button

The most basic button you can use in your app:

```yaml
button:
  text: Click me!
  icon: solar:heart-linear
  on_click:
    alert: Button clicked!
```

## Properties

```yaml
button:
  text: # string -- The button label
  icon: # IconProps | string -- Leading icon (from icones.js.org)
  trailing_icon: # IconProps | string -- Trailing icon
  loading: # boolean -- Show loading spinner
  disabled: # boolean -- Disable the button
  class: # string -- Additional CSS classes
  variant: # string -- Visual variant (filled, outline, ghost, link, or custom)
  size: # string -- Size (sm, md, lg, or custom)
  color: # string -- Color from the palette (primary, gray, positive, destructive, or custom)
  on_click: # Operations -- List of operations to execute on click
```

## Icon Buttons

Buttons can also have icons or be used as icon buttons:

```yaml
# Button with leading icon
- button:
    text: Love it!
    icon: solar:heart-linear

# Icon-only buttons
- button:
    icon: solar:like-linear
- button:
    icon: solar:share-linear
- button:
    icon: solar:trash-bin-trash-linear

# Button with trailing icon
- button:
    text: Upload
    trailing_icon: solar:cloud-upload-linear

# Button with loading state
- button:
    text: Loading...
    loading: true
```

> **Pro Tip:** If you want the button to have the same width and height you can use the `size` class from Tailwind CSS. For example, `size-9` will make the button 36px wide and 36px high.

## Variants

Buttons come in 4 variants by default: `filled` (the default), `outline`, `ghost`, and `link`. You can also define your own variants in your theme file. See the [Customization](#customization) section for more details.

```yaml
- button:
    text: Filled
    color: primary
    variant: filled  # this is the default. You can omit this property.
- button:
    text: Outline
    color: primary
    variant: outline
- button:
    text: Ghost
    color: primary
    variant: ghost
- button:
    text: Link
    color: primary
    variant: link
```

## Sizes

Buttons come with a set of 3 predefined sizes: `sm`, `md`, and `lg`. You can easily override the sizes in your theme file, or add your own sizes.

```yaml
- button:
    text: Small
    size: sm
- button:
    text: Medium
    size: md
- button:
    text: Large
    size: lg
```

## Colors

Buttons come with the default color palette, but you can easily override the colors with your own. The built-in colors are: `primary`, `gray`, `positive`, and `destructive`.

```yaml
# Default (no color specified)
- button:
    text: Default

# Primary color
- button:
    text: Primary
    color: primary

# Gray color
- button:
    text: Gray
    color: gray

# Positive color
- button:
    text: Positive
    color: positive

# Destructive color
- button:
    text: Destructive
    color: destructive
```

Each color works with all variants (filled, outline, ghost, link).

## Customization

### Custom Variants

You can define or add your own variants using the `forms.button.variants` setting in your theme file:

```yaml
# In your theme file:
forms:
  button:
    variants:
      my-gradient-variant: bg-linear-to-r from-color-500 to-purple-500 text-white
```

Then use it:

```yaml
- button:
    text: Primary Gradient
    color: primary
    variant: my-gradient-variant
- button:
    text: Secondary Gradient
    color: secondary
    variant: my-gradient-variant
```

### Custom Sizes

You can also define your own sizes in your theme file:

```yaml
# In your theme file:
forms:
  common:
    sizes:
      my-size: h-14 px-5 text-2xl
```

```yaml
button:
  text: My Size
  size: my-size
```

> **Pro Tip:** When adding a new size you should consider adding a `common.border_radius` setting to the size as well. For example, if you add a `my-size` size, you should also add a `common.border_radius.my-size` setting in your theme file.

### Custom Colors

You can define your own colors by overriding the `colors` theme or even adding new ones. In this example, we'll add a new color called `my-custom-color` to the palette:

```yaml
# In your theme file:
colors:
  my-custom-color:
    DEFAULT: "#34d399"
    50: "#ecfdf5"
    100: "#d1fae5"
    200: "#a7f3d0"
    300: "#6ee7b7"
    400: "#34d399"
    500: "#10b981"
    600: "#059669"
    700: "#047857"
    800: "#065f46"
    900: "#064e3b"
    950: "#022c22"
```

Then use it:

```yaml
- button:
    text: Filled
    color: my-custom-color
    variant: filled
- button:
    text: Outline
    color: my-custom-color
    variant: outline
```

> **Pro Tip:** You can **change** or **add** colors to the palette in your theme file. The built-in colors are: `primary`, `gray`, `positive`, and `destructive`.

### Support Colors on Variants

Let's say you want to create a new variant for your buttons that supports **all the colors defined in your palette**. For this we have a special `color` variable for TailwindCSS color classes that dynamically changes accordingly to the `color` property. So if you want to support different colors in your variants, you can do something like this:

```yaml
# In your theme forms.button.variants setting:
my-custom-variant: bg-color-500 text-color-contrast
```

The `bg-color-500` and `text-color-contrast` will be automatically replaced with the correct color values you define in the `color` property of the button. So if your button has the property `color: primary`, the background color will be `bg-primary-500` and the text color will be `text-primary-contrast`.

> **Pro Tip:** The `*-color-*` classes are special classes that dynamically set the color based on the current CSS Variable for that CSS class.

## Theme Settings

```yaml
forms:
  button:
    variants:
      default:
      filled:
      outline:
      ghost:
      link:
```
