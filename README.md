# Coach Pilot

React 19 + TypeScript + Vite single-page app for building and scheduling workouts.

## Local development

```bash
npm install
npm run dev
```

## GitHub Pages deployment

This repository is configured to deploy automatically to GitHub Pages through GitHub Actions.

How it works:

- Pushing to `main` runs `.github/workflows/deploy-pages.yml`
- The workflow builds the app and publishes the `dist` output to GitHub Pages
- `vite.config.ts` automatically uses the repository name as the production base path on GitHub Actions

What you need to do:

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Source: GitHub Actions`.
4. Push changes to `main` or run the workflow manually from the `Actions` tab.

Your site URL will be:

`https://<your-github-username>.github.io/<your-repository-name>/`
