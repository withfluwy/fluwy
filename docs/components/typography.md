# Typography

Fluwy provides a set of primitive typography components for headings, paragraphs, and text formatting. These map directly to their HTML counterparts.

## Headings

Fluwy supports all six levels of headings:

```yaml
- h1: H1 Heading
- h2: H2 Heading
- h3: H3 Heading
- h4: H4 Heading
- h5: H5 Heading
- h6: H6 Heading
```

Each heading component accepts a `class` property for custom styling:

```yaml
h1:
  class: mb-0
  content: Custom Styled Heading
```

## Paragraphs

Use the `p` component for paragraph text:

```yaml
p: This is a paragraph of text content.
```

## Text

The `text` component renders inline text:

```yaml
text: This is inline text content.
```

With custom styling:

```yaml
text:
  class: text-4xl font-bold
  content: Styled Text
```

## Bold Text

Use the `b` component for bold text:

```yaml
b: This text is bold
```

## Markdown

The `markdown` component renders Markdown content with syntax highlighting support:

```yaml
markdown: |
  This is **bold** and this is *italic*.

  - List item 1
  - List item 2

  ```javascript
  console.log('Hello, World!');
  ```
```

With custom class and ID:

```yaml
markdown:
  id: content
  class: doc-content
  generate_ids: true
  content: |
    ## Section Title
    Your markdown content here...
```

The `generate_ids` property automatically generates HTML IDs for headings, useful for table of contents linking.

## Links

The `link` component creates hyperlinks:

```yaml
link:
  href: https://example.com
  content: Visit Example
```

## Images

The `image` component displays images:

```yaml
image:
  src: /path/to/image.png
  alt: Description of the image
```

## Layout Components for Text

### Row

The `row` component creates a horizontal flex layout:

```yaml
row:
  class: gap-2
  content:
    - text: Left
    - text: Right
```

### Column

The `column` component creates a vertical flex layout:

```yaml
column:
  class: gap-2
  content:
    - text: Top
    - text: Bottom
```

### Div

The `div` component is a generic container:

```yaml
div:
  class: p-4 bg-blue-50 rounded
  content:
    p: Content inside a div
```

## Code

The `code` component displays code blocks with syntax highlighting:

```yaml
code:
  language: yaml
  content: |
    button:
      text: Click me
      on_click:
        alert: Hello!
```
