---
title: Troubleshooting
---

# Troubleshooting

## Flags always return defaults

- Verify provider credentials are present in server environment variables.
- Confirm route base matches configured `flagRouteBase`.
- Check server logs for provider initialization warnings.

## Context targeting not applied

- Ensure client context headers are being sent by the module plugin.
- Confirm payload size/format constraints are not being violated.

## Useful commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:typecheck
pnpm docs:build
```
