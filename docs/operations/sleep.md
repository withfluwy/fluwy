# sleep

Pauses the operation chain for a specified number of milliseconds before continuing. Useful for demonstrating loading states during development or adding intentional delays.

## Structure

```yaml
sleep: milliseconds
```

## Examples

**Wait before showing a notification:**

```yaml
button:
  on_click:
    post:
      url: /api/contacts
      data: form.data
    sleep: 1000
    notify: "Contact saved!"
```

**Simulate loading delay for testing:**

```yaml
form:
  on_submit:
    sleep: 2000
    log: "Form submitted after delay"
```

**Demonstrate a button loading spinner:**

```yaml
button:
  text: Save
  on_click:
    sleep: 1500
    notify: "Done!"
```

The button will show its loading state for 1.5 seconds before the notification appears.

## Availability

Server and client.

## Related

- [if](if.md) -- Conditional execution
- [emit](emit.md) -- Event communication
- [abort](abort.md) -- Stop an operation chain
