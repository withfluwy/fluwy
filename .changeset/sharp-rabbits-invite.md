---
'@fluwy/ui': patch
---

Fix how app render was rendering layouts with null values on it. Any null value was being replaced by the body content of the page. Now this is fixed.
