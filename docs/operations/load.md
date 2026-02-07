# load

Makes multiple GET requests in parallel and injects each response into the context with the given variable name. This is the recommended way to load page data on the server.

## Structure

```yaml
server:
  load:
    variable_name_1: url_1
    variable_name_2: url_2
```

Each key becomes a context variable name, and each value is the URL to fetch. All requests execute in parallel, and the variables are set at the same time.

## Examples

**Loading multiple resources for a page:**

```yaml
server:
  load:
    contact: https://api.example.com/contacts/${params.id}
    permissions: https://api.example.com/users/${params.id}/permissions
---
h1: Contact ${contact.first_name} ${contact.last_name}
p: ${contact.email}
```

**Loading data for a dashboard:**

```yaml
server:
  load:
    stats: https://api.example.com/dashboard/stats
    recent_orders: https://api.example.com/orders?limit=5
    notifications: https://api.example.com/notifications
---
h1: Dashboard
h2: Recent Orders
table:
  data: recent_orders
  columns:
    - header: Order
      content: ${record.id}
    - header: Status
      content: ${record.status}
```

## Availability

Server-side only.

## Related

- [get](get.md) -- Single GET request
- [vars](vars.md) -- Set variables from responses
- [authenticate](authenticate.md) -- Protect pages before loading data
