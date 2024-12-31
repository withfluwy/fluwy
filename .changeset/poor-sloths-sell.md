---
'@fluwy/ui': minor
---

Add `expires_at` option to `set_auth_token` operation. This is useful when the authentication provider gives you a `exp` timestamp from JWT standard which specifies when that token expires. This will be used to set the cookie expiration timestamp.
