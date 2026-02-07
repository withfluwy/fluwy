# get

Makes a GET request to a given URL and injects the response into the operation chain context.

## Structure

```yaml
# Simple (URL only)
get: https://api.example.com/resource

# With options
get:
  url: string         # URL to make the GET request
  path: string        # Optional. Path to extract data from the response
  on_error: Operations  # Optional. Operations to handle errors (status >= 300)
```

## Examples

**Loading page data on the server:**

```yaml
server:
  get: https://api.example.com/contacts/${params.id}
  vars:
    contact: response.data
---
h1: Contact ${contact.first_name} ${contact.last_name}
p: ${contact.email}
```

**Extracting nested data with `path`:**

If your API wraps data inside a `data` object, use the `path` parameter to extract it:

```yaml
server:
  get:
    url: https://api.example.com/contacts/${params.id}
    path: data
```

**Client-side fetch on button click:**

```yaml
button:
  text: Load Details
  on_click:
    get: https://api.example.com/items/${item.id}
    log: "Fetched: ${response.data.name}"
```

## Availability

Server and client.

## Related

- [post](post.md) -- Create resources
- [put](put.md) -- Update resources
- [delete](delete.md) -- Delete resources
- [load](load.md) -- Parallel data loading
- [vars](vars.md) -- Store response data in context
