# @fluwy/ui

## 0.8.1

### Patch Changes

- c2a0a28: Fix `goto` operation to work on both client-side and server-side.
- 18127b2: Add missing handlers for `POST`, `PUT`, `PATCH`, and `DELETE` to the sveltekit's `createProxyApiHandlers` method.
- 35fbd0e: Fix how app render was rendering layouts with null values on it. Any null value was being replaced by the body content of the page. Now this is fixed.

## 0.8.0

### Minor Changes

- dd0fda0: New `vars` and `load` operations.
- b60702a: New `set_cookie` and `unset_cookie` operations. These operations requires the sveltekit's hook handle into your app.
- 7836caa: New `debug` component.
- e6e34d6: New `clear_form_errors` operation to clean validation errors on forms.
- 92a6d4e: New `put` http request operation
- 650933d: Spacer now supports CSS classes as its content so we can easily do something like `spacer: mt-12` if we need some classes for the spacer.
- cd356e5: New input component.
- b3183e5: Adds the `server` feature for the page head so we can perform operations on the server side only. This is useful when we want to load content from sources and set their results as variables in the context so the page loads from the server with the content populated. This increases the page load speed and is helpful to perform operations that are server-side only.
- e90b19f: New `set_form_errors` operation for form validation errors from APIs.
- 6a412b8: New `post` operation to make http requests.
- 8b69949: New `unset_auth_token` that is usually used as the "logout" operation.
- 2dade5e: Make `column` and `row` themable under layout variables. It also sets the default gap of `gap-4` for them.
- 17d3563: Introducing plugins
- 67ca6ba: Created the Plugin System. Now all applications are basically plugins which contains a name that will be used as namespace.
- e203702: New `authenticate` operation for server and client sides. A use is considered authenticated if the `auth_token` is set in the server and context. A cookie is created for the authentication process.
- 998c5c0: New context functions for plugin development and library building for the framework: `createContext`, `useContext`.
- 6ec2a6e: New `set_auth_token` operation.
- 4b9677c: New `sleep` operation.
- 382a87d: New `form` component.
- 8959b80: New `input` component.

### Patch Changes

- e2dfd64: chore: Fix version name for releases

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
