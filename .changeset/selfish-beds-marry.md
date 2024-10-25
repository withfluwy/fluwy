---
'@fluwy/ui': patch
---

Fix usage of context with useCommon, and useTheme functions. Those functions should be used outside the html code, and should be assigned to a const variable inside the script.
