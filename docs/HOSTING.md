# Hosting Rostrum Grand

This guide covers the approved navy website, its 570-article archive, and the files needed to run it without this Codex workspace. Last checked on 1 November 2026.

| Location | Address | How it updates |
| --- | --- | --- |
| Source code | [elliotnis/rostrum-grand](https://github.com/elliotnis/rostrum-grand) | Git commits |
| GitHub Pages | [Open the website](https://elliotnis.github.io/rostrum-grand/) | Automatically after a push to `main` |
| Existing GCP website | [Open Cloud Run](https://rostrum-grand-46003867652.asia-east2.run.app/) | Manual deployment described below |

The same source supports both hosts. GitHub Pages uses `/rostrum-grand/` as its base path; GCP and localhost use `/`. Fonts, images, article downloads and navigation resolve against the appropriate base path.

## 1. Run it on your computer

Install Git and Node.js 24, which includes npm. The `.nvmrc` file records the Node version if you use nvm.

```bash
git clone https://github.com/elliotnis/rostrum-grand.git
cd rostrum-grand
npm ci
npm run dev
```

Open **http://localhost:5180/**. Leave the terminal running while you use the site. Press `Ctrl+C` to stop it. If port 5180 is occupied, stop the other development server or choose another port:

```bash
npm run dev -- --port 5182
```

No environment variables or API keys are required to view this website. Content and font files are included in the repository.

## 2. Publish updates to GitHub Pages

GitHub Pages is already configured for this repository. To publish a change:

1. Edit the source files and check the result locally.
2. Run the build and source checks:

   ```bash
   npm run lint -- src
   npm run build:pages
   ```

3. Commit and push the files you changed:

   ```bash
   git add src README.md docs
   git commit -m "Describe the website update"
   git push origin main
   ```

   Include `public`, configuration files or other paths in `git add` when those are part of your update. Generated `dist` files and `node_modules` should stay untracked.

4. Open [Actions](https://github.com/elliotnis/rostrum-grand/actions). Wait for **Publish GitHub Pages** to finish successfully.
5. Open **https://elliotnis.github.io/rostrum-grand/**. Refresh the browser if an older version remains visible.

The workflow installs the locked dependencies, checks the source, builds the site, prepares direct page URLs, and uploads `dist` to GitHub Pages. It uses GitHub's built-in deployment token; no personal access token or GCP credentials need to be added as repository secrets. The existing linter warnings do not prevent a successful build.

You can also open **Actions → Publish GitHub Pages → Run workflow** to publish the current `main` commit again.

### Set up Pages in a new copy of the repository

1. Push the project to a repository you own.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Make sure Actions is enabled for the repository, then run the included workflow.
5. If the repository name is different, update the `--base=/rostrum-grand/` value in the `build:pages` script in `package.json` to match the new repository name. Update the URLs in this guide too.

GitHub Pages supports public repositories on GitHub Free; private source repositories require a plan that supports Pages. See [GitHub's availability guide](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

### Test the Pages build before publishing

```bash
npm run build:pages
npm run preview:pages -- --host 127.0.0.1 --port 5181
```

Open **http://localhost:5181/rostrum-grand/**. Test a direct page URL such as **http://localhost:5181/rostrum-grand/rg-lab/** as well as the homepage.

`scripts/prepare-pages.mjs` creates entry files for the core pages, all articles and the original article URL aliases. This is needed because GitHub Pages does not provide the NGINX rewrite used by Cloud Run. It also writes a `404.html` application shell and `.nojekyll`.

## 3. Deploy to the existing Google Cloud service

Pushing to GitHub updates GitHub Pages. It does **not** deploy to GCP. To update the existing GCP service, use the project below and a Google account with deployment access.

| Setting | Value |
| --- | --- |
| Project | `finance-department-494117` |
| Region | `asia-east2` (Hong Kong) |
| Cloud Run service | `rostrum-grand` |
| Runtime identity | `rostrum-grand-web@finance-department-494117.iam.gserviceaccount.com` |
| Health endpoint | `/health` |

Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), then authenticate:

```bash
gcloud auth login
gcloud config set project finance-department-494117
```

From the repository root, validate and deploy:

```bash
npm ci
npm run build
gcloud run deploy rostrum-grand \
  --source=. \
  --project=finance-department-494117 \
  --region=asia-east2 \
  --platform=managed \
  --service-account=rostrum-grand-web@finance-department-494117.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --ingress=all \
  --port=8080 \
  --memory=256Mi \
  --cpu=1 \
  --cpu-throttling \
  --no-cpu-boost \
  --min=0 \
  --max=2 \
  --concurrency=80 \
  --timeout=30 \
  --labels=app=rostrum-grand
```

The plain `npm run build` uses the domain root path required by GCP. Cloud Run builds the included `Dockerfile`, so a local Docker installation is not required for this command. The container serves the generated site with NGINX on port 8080. `.gcloudignore` and `.dockerignore` exclude local dependencies, build output and environment files.

After deployment:

```bash
curl -f https://rostrum-grand-46003867652.asia-east2.run.app/health
```

The response should be `ok`. Open the homepage, an investment page and an article directly to check navigation, fonts and images. Cloud Run traffic, builds and stored images are billed to the GCP project.

### Deploying to another Google Cloud project

Create or select a project with billing enabled. Follow Google's [source deployment setup and IAM instructions](https://docs.cloud.google.com/run/docs/deploying-source-code) to enable the APIs and give the deployer and build service account the required roles. Create a runtime service account in that project, then replace the project, service account and region in the deployment command. Use the service URL returned by that deployment; the existing URL above belongs to the current project.

### Roll back a GCP deployment

List revisions and identify a previously working revision:

```bash
gcloud run revisions list \
  --service=rostrum-grand \
  --project=finance-department-494117 \
  --region=asia-east2
```

Then send traffic to that revision, replacing `WORKING_REVISION` with its exact name:

```bash
gcloud run services update-traffic rostrum-grand \
  --project=finance-department-494117 \
  --region=asia-east2 \
  --to-revisions=WORKING_REVISION=100
```

## 4. Run the production container yourself

If Docker is installed:

```bash
docker build -t rostrum-grand .
docker run --rm -p 8080:8080 rostrum-grand
```

Open **http://localhost:8080/**. The NGINX configuration includes SPA routing, gzip, cache headers and real 404 responses for missing assets and article JSON. For another host, run `npm run build`, publish `dist`, and configure the host to serve `index.html` for application routes. Static hosts without rewrites can use the generated route entries from the Pages preparation script.

## 5. Where to make changes

| Change | File or directory |
| --- | --- |
| Page layout and navigation | `src/pages/` and `src/components/site.tsx` |
| Original headings, copy and team biographies | `src/data/site.json` |
| Navy theme and text contrast | `src/navy-theme.css` |
| Typography, rounded cards and phone layouts | `src/brand-refinements.css` |
| Animations | `src/components/motion.tsx` and `src/motion.css` |
| Images and local fonts | `public/assets/` |
| Article listing | `public/content/posts.json` |
| Full article bodies | `public/content/articles/<slug>.json` |
| GitHub deployment | `.github/workflows/pages.yml` |
| Cloud Run serving configuration | `Dockerfile` and `deploy/nginx.conf.template` |

To add an article, add its metadata to `posts.json` and a matching JSON file in `public/content/articles`. Use a unique `id` and `slug`, preserve the existing field structure, and place local images in `public/assets`. The next Pages build generates its direct route automatically.

This is a saved content snapshot, not a connection to the original WordPress CMS. The contact form prepares an email draft for the visitor to review and send using their email app. It has no mail-delivery backend.

## Troubleshooting

- **Blank page or missing assets on Pages:** verify the build base is `/rostrum-grand/` and open the repository URL including that prefix. Images, JSON fetches and fonts must resolve inside that path. Use `publicUrl` from `src/lib/urls.ts` when adding a root-relative public asset in React.
- **A page works through navigation but not after refresh:** rerun `npm run build:pages` so the static route entry files are included. On GCP, keep the supplied NGINX rewrite configuration.
- **An article image or link breaks:** article HTML should use root-relative paths such as `/assets/example.png`; the app resolves these against the deployment base. External links are kept unchanged.
- **GitHub deployment fails:** inspect the failed step in Actions, confirm Pages uses GitHub Actions as its source, and allow the workflow's `pages: write` and `id-token: write` permissions. No manually copied access token is required.
- **GCP reports a permission or build error:** confirm the selected account and project with `gcloud auth list` and `gcloud config get-value project`. Check the Cloud Build logs and the roles in Google's source deployment guide.
- **The contact form does not send automatically:** it opens an email draft. A separate mail backend is needed for server-side delivery.

## Official references

- [Vite deployment and base paths](https://vite.dev/guide/static-deploy)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Google Cloud Run source deployment](https://docs.cloud.google.com/run/docs/deploying-source-code)
