# Avatar

The avatar component displays a user's profile picture with an automatic initials fallback when no image is available.

## Basic Usage

```yaml
avatar:
  name: "John Doe"
  src: "https://example.com/avatar.jpg"
```

If the image fails to load, the avatar displays the user's initials ("JD") as a fallback.

## Properties

```yaml
avatar:
  src: # string -- Image URL
  name: # string -- Full name (used for generating initials fallback)
  alt: # string -- Alt text for the image. Defaults to name
  show_initials: # boolean -- Show initials when image is unavailable. Defaults to true
  only_first_and_last: # boolean -- Use only first and last name initials. Defaults to true
  size: # "sm" | "md" | "lg" -- Size variant. Defaults to "md"
  class: # string -- Additional CSS classes
  content: # string -- Alternative image URL (used if src is not provided)
```

## Sizes

```yaml
# Small (32px)
avatar:
  name: "Alice"
  size: sm

# Medium (40px, default)
avatar:
  name: "Bob"
  size: md

# Large (48px)
avatar:
  name: "Charlie"
  size: lg
```

## Examples

### Image Avatar

```yaml
avatar:
  src: "https://example.com/photo.jpg"
  name: "Jane Smith"
  size: lg
```

### Initials Only

When no `src` is provided or the image fails to load, initials are shown automatically:

```yaml
avatar:
  name: "Marco Antonio Silva"
  # With only_first_and_last: true (default), shows "MS"
  # With only_first_and_last: false, would show "MAS"
```

### In a Layout

```yaml
row:
  class: items-center gap-3
  content:
    - avatar:
        name: ${user.name}
        src: ${user.avatar_url}
        size: sm
    - text: ${user.name}
```

## Related

- [Dropdown](dropdown.md) -- Avatars as dropdown triggers
- [Icon](icon.md) -- Icon component
