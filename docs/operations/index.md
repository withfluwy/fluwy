# Operations

Operations in Fluwy are a sequence of actions that you can perform as a reaction to an event from a user or a component.

## What is an Operation?

Fluwy, like native HTML elements, supports event handling and is an event-based framework. It contains a context depending on the event that triggered the list of operations. On the technical side, an operation is basically a function that is executed in sequence when an event is triggered.

For example, when a button is clicked, it dispatches an event and if you have set the property `on_click` in the button component, the operations listed there will be executed in sequence.

```yaml
button:
  text: Show Alert
  on_click:
    alert: Button clicked!
```

In the example above, when the button is clicked, the `alert` operation will be executed. Usually the properties with the prefix `on_` are event handlers and they receive a list of operations as an argument. You can provide the operations as keys of an object or as a list. The example above received the operations as an object containing the `alert` operation only.

### Alternative List Syntax

This would be an alternative way to define the operations as a list:

```yaml
button:
  text: Show Alert
  on_click:
    - alert: Button clicked!
```

Fluwy is flexible enough to accept both types of definitions and you can use one or the other depending on your needs. This was intended for readability and simplicity. You should use the list syntax if you want to repeat operations since you can't use duplicated keys in an object in YAML:

```yaml
button:
  text: Show Alert
  on_click:
    - alert: Button clicked!
    - alert: Button clicked again!
```

## Built-in Operations

| Category | Operations |
|----------|-----------|
| HTTP | [`get`](get.md), [`post`](post.md), [`put`](put.md), [`delete`](delete.md), [`load`](load.md) |
| Navigation | [`goto`](goto.md), [`refresh`](refresh.md) |
| Auth | [`set_auth_token`](set-auth-token.md), [`unset_auth_token`](unset-auth-token.md), [`authenticate`](authenticate.md) |
| Forms | [`set_form_errors`](set-form-errors.md), [`clear_form_errors`](clear-form-errors.md) |
| UI | [`open_dialog`](open-dialog.md), [`close_dialog`](close-dialog.md), [`notify`](notify.md), [`alert`](alert.md), [`set_mode`](set-mode.md) |
| Data | [`vars`](vars.md), [`log`](log.md), [`context`](context-op.md), [`extract`](extract.md), [`transform`](transform.md), [`wrap_into`](wrap-into.md) |
| Cookies | [`set_cookie`](set-cookie.md), [`unset_cookie`](unset-cookie.md), [`remove_cookie`](remove-cookie.md) |
| Flow Control | [`if`](if.md), [`sleep`](sleep.md), [`emit`](emit.md), [`abort`](abort.md) |
| Local Storage | [`unset_local_storage`](unset-local-storage.md), [`remove_local_storage`](remove-local-storage.md) |

## Custom Operations

You can also define and register your own operations to be used in your app. This is the syntax of the signature of an operation in TypeScript:

```typescript
import type { Operation } from '@fluwy/ui';

export const my_operation: Operation = (params, options) => {
  // Do something
};
```

To register your operation, you register it in your plugin file like this:

```typescript
import type { Plugin } from '@fluwy/ui';
import { my_operation } from './path/to/operations';

export const MyApp: Plugin = {
  name: 'app',

  operations: {
    my_operation, // <-- Your operation here
  },
};
```

Now to use your operation:

```yaml
button:
  text: Show Alert
  on_click:
    app.my_operation: Button clicked!
```

To register your plugin you can use the `plug` method from the `client` module from the `@fluwy/ui` package:

```typescript
import { client } from '@fluwy/ui';
import { MyApp } from './path/to/plugin';

client.plug(MyApp);
```

To understand more about plugins and how to use them, check the documentation on the [Plugins](../concepts/plugins.md) page.

## How to Interrupt an Operation Chain

If you want to interrupt an operation chain, you can use the [`abort`](abort.md) helper function. For example, if you want to abort an operation chain if the user is not logged in:

```typescript
import { abort } from '@fluwy/ui';

export const my_operation: Operation = (params, { context }) => {
  if (!context.current_user) {
    abort('You must be logged in to perform this operation.');
  }
};
```

Assuming you set the authenticated user in your context under the key `current_user`.

## Best Practices

When working with operations, keep these best practices in mind:

- Use meaningful operation names that describe the action
- Use snake_case for operation names to keep them consistent with the framework
- Unit test your operations
- Follow the SOLID principles
- Throw `AbortOperation` to abort an operation, or use the `abort` helper function
- Handle errors appropriately in HTTP operations
- Keep operation chains simple and focused
