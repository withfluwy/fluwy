# @fluwy/ui

## 0.7.0

### Minor Changes

- ad3d1e3: New `utils` module with useful helpers
- 017f516: New `emit` operation to emit events via `Events` event bus.
- f1ddc80: New email display component.
- 6a4d29a: Pagination now reacts to table fetching which disables the navigation buttons and page input when table is fetching.
- 1fff592: Add alert operation
- dc89520: Add `displays.table.page_size` theme option to customize the page size of a page. Also supports inline option on the `table` component.
- a6b6081: Add tables with customizable rows and headers
- aa3b04c: Make table component themeable
- 4dc0981: Make pagination themeable
- 3751196: New `log` operation to log things using `console.log` in the browser.

### Patch Changes

- 7d0f4cf: Add documentation to table with real API example.
- dba8805: Fixes button disabled opacity on hover. Fixes dark style for table headers.
- 4ebca50: Fixed horizontal scroll on markdown code blocks

## 0.6.0

### Minor Changes

- 71d4bf8: Add new theme setting `common.spinner` to customize spinner of buttons and other components.

### Patch Changes

- 6bbb272: Fix button outline style and settings.

## 0.5.0

### Minor Changes

- f445786: New components for the markdown: code block, code span, hr, blockquote.

## 0.4.3

### Patch Changes

- 44304bc: Fix firefox compatibility issues. Firefox doesn't support `computedStyleMap` function on DOM elements which was breaking fluwy.

## 0.4.2

### Patch Changes

- fb178be: Fix sidebar on mobile devices while loading the app with tailwind classes instead of javascript.

## 0.4.1

### Patch Changes

- 98baa53: Fix usage of context with useCommon, and useTheme functions. Those functions should be used outside the html code, and should be assigned to a const variable inside the script.

## 0.4.0

### Minor Changes

- 28031d9: New Tabs Component

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
