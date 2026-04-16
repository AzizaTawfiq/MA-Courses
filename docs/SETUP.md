# Setup

This workspace uses `pnpm` and is pinned with the root `packageManager` field.

## Install

From the repository root in Windows PowerShell:

```powershell
corepack enable
corepack pnpm install
npm run dev
```

## Important

Do not run `npm install` in this repository. It can create a mixed dependency tree where optional native packages are missing, which breaks Nuxt startup on Windows.

If the workspace gets into a bad state, remove the installed dependencies and reinstall with pnpm:

```powershell
Remove-Item -Recurse -Force node_modules, frontend\node_modules, backend\node_modules
corepack pnpm install
```
