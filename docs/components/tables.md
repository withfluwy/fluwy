# Tables

The table component displays data in a tabular format with built-in support for server-side pagination. It fetches data from an API endpoint and renders it with configurable columns.

## Basic Usage

```yaml
table:
  url: https://api.example.com/items/contacts
```

## Properties

```yaml
table:
  # Unique identifier for the table. Required when using pagination.
  id: string

  # URL to fetch data from (GET request)
  url: string

  # HTTP headers to include in the request
  headers: Record<string, string>

  # The HTTP credentials mode for the request.
  # Options: "omit" (default), "same-origin", "include"
  credentials: string

  # Operations to perform when a row is clicked
  on_row_click: operations

  # Column definitions
  columns: array
    - header: string | template    # Column header text or template
      class: string                # CSS class for column cells
      content: string | template   # Cell content text or template
      on_click: operations         # Operations when cell is clicked

  # Parameter mapping for pagination
  params:
    page_size: limit  # Maps the page_size param to API's param name

  # Path mapping for response data
  paths:
    total: meta.filter_count  # Path to total count in API response
```

## Full Example

This example fetches data from an API and displays it with multiple column types:

```yaml
table:
  id: contacts_table
  url: https://api.fluwy.com/items/contacts?meta=*&fields=*.*
  on_row_click:
    alert: "Row click event for: ${record.first_name} ${record.last_name}"
  params:
    page_size: limit
  paths:
    total: meta.filter_count
  columns:
    - content: ${record.first_name} ${record.last_name}
      on_click:
        alert: "Cell click event for: ${record.first_name} ${record.last_name}"
      header:
        row:
          class: font-bold dark:text-white gap-2
          content:
            - icon: solar:user-circle-bold
            - text: Name
    - header: Email Component
      content:
        email: ${record.email}
    - header: Phone
      content:
        if record.phone:
          phone: ${record.phone}
    - header: Created At
      content:
        date: ${record.date_created}
    - header: Updated At
      content:
        if record.date_updated:
          date_from_now: ${record.date_updated}
    - header: Created By
      content: ${record.user_created.first_name} ${record.user_created.last_name}
```

## Pagination

The pagination component is used to navigate through the pages of the table. It's automatically generated based on the response from the API. Match the `id` of the table with the `for` property of the pagination component. You can place the pagination component anywhere on the page.

```yaml
pagination:
  for: contacts_table  # Required. The id of the table to paginate.
  class: string        # Optional CSS class
```

### Example with Pagination

```yaml
# Table
table:
  id: contacts_table
  url: https://api.example.com/contacts?meta=*
  params:
    page_size: limit
  paths:
    total: meta.filter_count
  columns:
    - header: Name
      content: ${record.name}
    - header: Email
      content:
        email: ${record.email}

# Pagination (can be placed anywhere on the page)
pagination:
  for: contacts_table
```

> **Note:** To generate the pagination properly you need to specify the `paths.total` property in the table component. By default it's set to `total` from the root of the response, make sure to change it if your endpoint returns a different property.

## Row Context

Each row's context has an object identified by the `record` variable. This object contains the data for the row and represents the data returned from the API response. Use `${record.field_name}` to access fields within column templates.

## Theme Settings

```yaml
displays:
  table:
    page_size:       # Number of rows per page
    header:
    wrapper:
    row:
      default:
      clickable:
    cell:
      default:
      clickable:
    pagination:
      wrapper:
```

## Related

- [Display Components](displays/index.md) -- Format dates, emails, phone numbers in table columns
- [`refresh`](../operations/refresh.md) -- Refresh a table after data changes
- [`get`](../operations/get.md) -- How table data is fetched
- [Conditions](../controls/conditions.md) -- Conditional content in table cells
