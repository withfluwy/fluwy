# @fluwy/ui

## 0.3.0

### Minor Changes

- bbb1275: New Avatar component
- 9a0b0b5: Fix jsdom dependency
- 8199324: Exposed Render component for custom integration with the framework.
- f7368e9: New component SidebarToggler to toggle the sidebar on small screens.

### Patch Changes

- c7defce: update layout colors and more

  Fixes:

  - buttons dark/light mode
  - adds support to spacer on sidebar
  - foreground colors for light and dark modes
  - padding on body's main content
  - aside border left is not part of the default style

## 0.2.0

### Minor Changes

- e2c80c2: New component TableOfContents for documentation
- 5088f26: New markdown component

## 0.1.0

### Minor Changes

- 62fefa3: Add ability to define theme on layout. Theme on page overrides theme defined on layouts.
- 75972af: New dropdown component
- 6f919f1: New Menu Item component
- b88a3ca: New layout components
- e1010a9: New spacer component for layouts
- 1ab971e: New repeat component.
- 0f3d46c: New link component
- fe3177a: New image primitive component
- 40429f3: New MenuGroup component.
- 5f392d8: New brand component that supports light and dark modes
- 0e8f2ba: New icon component with iconify
- d7add87: Goto operator now supports external urls
- f92abb6: New Dark Mode Toggler component and add support to dark mode on the dropdown component.
- 8c4e35a: New screen component to compose the layout of the screen

### Patch Changes

- b97d3bc: Fix theming on typography. Classes are merged instead of replaced when theming typographies.

## 0.0.5

### Patch Changes

- 5f36ded: Fix iconify-icon dependency.

## 0.0.4

### Patch Changes

- b3ec270: Fix `prepublishOnly` script to use the build script that solves the css generation file with tailwind.

## 0.0.3

### Patch Changes

- a88e11a: Fix styles again

## 0.0.2

### Patch Changes

- 4d6a40a: Fix how we generate the CSS file on build step

## 0.0.1

### Patch Changes

- 53dd764: First release with button component
