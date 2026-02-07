# HTTP Operations

HTTP Operations are a set of built-in operations that you can use on events to make HTTP requests and inject the response into your operation chain.

## get

The `get` operation is used to make a GET request to a given URL and inject the response into the context of your operation chain.

### Structure

```yaml
get:
  url: string         # URL to make the GET request
  path: string        # Optional. Path to extract data from the response
  on_error: Operations  # Optional. Operations to handle errors (status >= 300)
```

### Loading Page Data

The best way to use the `get` operation is to load content to be displayed on the page. For example, to load contact information on a page at `app/pages/contacts/[id]/index.yaml`:

```yaml
server:
  get: https://api.example.com/contacts/${params.id}
  vars:
    contact: response.data
```

The `vars` operation will create a variable called `contact` in the context of the page. Then, in the page content, you can use the `contact` object:

```yaml
h1: Contact Page ${contact.first_name} ${contact.last_name}
p: ${contact.email}
```

### Extracting Nested Data

If your API returns data wrapped inside a `data` object, use the `path` parameter to extract it:

```yaml
server:
  get:
    url: https://api.example.com/contacts/${params.id}
    path: data
```

## post

The `post` operation is used to make a POST request to a given URL and inject the response into the context of your operation chain.

### Structure

```yaml
post:
  url: string           # URL to send the POST request to
  data: object          # Data to send with the request (from context)
  on_error: Operations  # Operations to handle errors (status >= 300)
```

### Example with Forms

```yaml
form:
  on_submit:
    post:
      url: /api/contacts
      data: form.data
      on_error:
        - alert: response.status
  content:
    - input:
        field: email
        label: Email Address
    - button:
        text: Submit
        type: submit
        color: primary
        icon: solar:plain-linear
```

## put

The `put` operation is usually used to update an existing resource by making a PUT request to a given URL.

### Structure

```yaml
put:
  url: string           # URL to send the PUT request to
  data: object          # Data to send with the request (from context)
  on_error: Operations  # Operations to handle errors (status >= 300)
```

### Example with Forms

```yaml
form:
  data:
    id: 1
    email: contact@mail.com
  on_submit:
    put:
      url: /api/contacts/${form.data.id}
      data: form.data
      on_error:
        - alert: response.statusText
  content:
    - input:
        field: email
        label: Email Address
    - button:
        text: Update
        type: submit
        color: primary
        icon: solar:pen-linear
```

> **Note:** The placeholder `${form.data.id}` in the `url` parameter is a template string that will be replaced with the value of whatever you have set inside the `${}` syntax. This is useful when you want to make a PUT request to a specific resource.

## load

The `load` operation is used to make multiple GET requests to given URLs and inject the result of each request into the context with the given variable name. The advantage is that you can load multiple resources at once since they will be executed in parallel, and the variables are set at the same time.

### Structure

```yaml
server:
  load:
    variable_name_1: url_1
    variable_name_2: url_2
```

### Example

```yaml
server:
  load:
    contact: https://api.example.com/contacts/${params.id}
    permissions: https://api.example.com/users/${params.id}/permissions
```

Then in your page content you can access those variables:

```yaml
h1: Contact ${contact.first_name} ${contact.last_name}
p: ${contact.email}
```
