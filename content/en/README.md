# English edition (reserved)

英文版正文预留目录，尚未翻译。

## How the English edition will work

- Translate `content/zh/` → `content/en/`, keeping the same directory/file
  structure and the same `{{code:<id>}}` markers untouched.
- Code examples are language-agnostic references: `code/csharp/` and
  `code/java/` are reused as-is, no code changes needed.
- Assemble with: `python3 tools/assemble.py --lang en --stack csharp`
  (or `--stack java`).
- The de-Englishing glossary (Chinese) and this README together define the
  terminology mapping for translators.
