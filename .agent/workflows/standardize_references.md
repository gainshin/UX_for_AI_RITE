---
description: Standardize references in src/data/cases.js
---

# Standardize References Workflow

This workflow describes how to ensure all references in `src/data/cases.js` follow the project's citation standards.

## 1. Citation Formats

### UX for AI Book
For references to the "UX for AI" book chapters, use the following format:

```javascript
"Chapter XX: [Chapter Title]",
"Nudelman, G., & Kempka, D. (2025). UX for AI: A framework for designing human-centric AI-driven products. Wiley.",
```

### 101 Design Methods
For references to "101 Design Methods", include the specific method line followed by the book citation:

```javascript
"101 Design Methods: [Method ID] [Method Name]",
"Kumar, V. (2012). 101 Design Methods: A Structured Approach for Driving Innovation in Your Organization. Wiley.",
```

## 2. Verification Steps

1.  **Scan `src/data/cases.js`**: Look for entries with `summary` fields mentioning "101 Design Methods".
2.  **Check References**: Ensure the corresponding `references` array contains both the specific method line and the full book citation.
3.  **Check Chapter References**: Ensure all "Chapter XX" references are followed by the Nudelman & Kempka citation.

## 3. Update Process

If any references are missing or incorrectly formatted:

1.  Identify the method ID.
2.  Extract the correct method name or chapter title.
3.  Update the `references` array in `src/data/cases.js` to match the required format.
