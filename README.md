# Lumn Workspace — Starter Template

A GitHub-ready starter for a browser-based IDE and fictional Virtual OS sandbox built around the proposed Lumn language.

## Current status

This repository is a **starter implementation**, not the complete Lumn platform.

Implemented:
- Dark developer workspace UI.
- Editable `.lumn` source panel.
- Small explicit Lumn starter interpreter for `SYSTEM`, `WINDOW`, `TEXT`, and `PRINT`.
- Basic virtual OS preview driven by parsed declarations.
- Local browser save/restore.
- Import/export of individual `.lumn` files.
- Starter language handbook and AI handoff copy action.

Not implemented yet:
- Full lexer/parser/AST compiler pipeline.
- Variables, functions, conditions, loops and event execution.
- Folder and ZIP project import/export.
- True virtual process, memory and storage managers.
- Snapshot/restore.
- Full Monaco Editor integration and autocomplete.
- Multi-project persistence and full debugger.

The UI labels planned functionality rather than pretending it works.

## Requirements

- Node.js 20+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Publish as a GitHub repository

1. Create a new empty GitHub repository named `lumn-workspace`.
2. Extract this ZIP.
3. Upload the contents of this folder to the repository root, or push it using Git.
4. In a terminal, run:

```bash
git init
git add .
git commit -m "Initial Lumn Workspace starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lumn-workspace.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Deploy

This is a Vite app and can be deployed to GitHub Pages, Vercel, or Netlify. For GitHub Pages, configure the Vite `base` option to match the repository path before deploying.

## Safety model

Lumn source is parsed by a deliberately limited interpreter. It is not evaluated as JavaScript and cannot execute native OS commands. Treat all imported project files as untrusted input as the language engine grows.
