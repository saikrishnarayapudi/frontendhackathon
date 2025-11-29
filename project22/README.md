# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment


If the site does not appear immediately, wait a minute and then refresh. You can also check the repository Settings → Pages to confirm the branch and URL.
### How to verify the public URL (quick)

- Open: `https://saikrishnarayapudi.github.io/frontendhackathon/`
- From PowerShell run:

```powershell
curl.exe -I "https://saikrishnarayapudi.github.io/frontendhackathon/"
curl.exe -I "https://raw.githubusercontent.com/saikrishnarayapudi/frontendhackathon/gh-pages/index.html"
```

If the first returns `HTTP/1.1 200 OK` the site is live. If the second returns `200` while the first returns `404`, open GitHub → Settings → Pages and re-select `gh-pages` as the source and save to force re-provisioning.

### Troubleshooting

- Ensure `gh-pages` branch exists (we publish to it). You can list remote branches:

```powershell
git fetch origin
git branch -r | Select-String "gh-pages"
```

- If Pages still shows 404 after waiting, re-deploy locally and/or check Actions logs:

```powershell
# rebuild and redeploy
npm install
npm run deploy

# check Actions (requires gh CLI login)
gh run list --repo saikrishnarayapudi/frontendhackathon
gh run view <run-id> --repo saikrishnarayapudi/frontendhackathon --log
```

If you want, I can check the Actions logs and re-run the deploy here — tell me which you prefer.
