# goto

Navigates to a specific route or external URL. Works on both server and client.

## Structure

```yaml
# Internal route
goto: /path

# With context variables
goto: /resource/${id}

# External URL (opens in new tab on client, redirects on server)
goto: https://example.com
```

## Examples

**Navigate to an internal page:**

```yaml
button:
  text: Go to Dashboard
  on_click:
    goto: /dashboard
```

**Navigate with dynamic parameters:**

```yaml
button:
  text: View Contact
  on_click:
    goto: /contacts/${contact.id}
```

**Navigate to an external URL:**

External URLs (starting with `http://` or `https://`) open in a new tab when triggered on the client, or redirect the user when triggered on the server.

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

**Redirect after form submission:**

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
    notify: "Contact created!"
    goto: /contacts
```

## Availability

Server and client.

## Related

- [refresh](refresh.md) -- Refresh a component without navigation
- [authenticate](authenticate.md) -- Redirect unauthenticated users
