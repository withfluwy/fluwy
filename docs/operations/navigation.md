# Navigation Operations

Navigation operations are essential for managing the flow and user experience within your application. This document outlines all the navigation-related operations available in Fluwy, providing you with the tools to create seamless and intuitive navigation patterns in your web applications.

## goto

The `goto` operation is used to navigate to a specific route. It can be used as both server and client operations. It accepts a string parameter with the route to navigate to.

### Basic Usage

```yaml
goto: /home
```

### With Context Variables

It also accepts variables from the context to be parsed into the route:

```yaml
goto: /user/${id}
```

### External URLs

If you use a full URL string, it will open the URL in a new tab (in the browser) or redirect the user to the URL (if the operation was run on the server):

```yaml
goto: https://example.com
```

### Example

```yaml
row:
  - button:
      text: Go to Plugins
      icon: solar:widget-add-linear
      on_click:
        goto: /concepts/plugins
  - button:
      text: Star on Github
      icon: mdi:github
      on_click:
        goto: https://github.com/withfluwy/fluwy
```
