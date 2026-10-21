# Architect Portfolio

Static architecture portfolio built with **Next.js** (App Router, static export), **Tailwind CSS**, Markdown projects, and **Decap CMS** at `/admin`.

Hosted as a free static site (e.g. Cloudflare Pages). No backend, no database.

## Stack

- Next.js with `output: 'export'` → builds to `out/`
- Tailwind CSS
- `gray-matter` + `remark` / `remark-html` for project Markdown
- Decap CMS (GitHub backend) for create / edit / delete

## Local development

### Requirements

- Node.js 20+ (22 recommended)
- npm

### Install & run the site

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Decap CMS locally

In a **second** terminal:

```bash
npx decap-server
```

Then open [http://localhost:3000/admin](http://localhost:3000/admin)
(or `/admin/` / `/admin/index.html`).

With `local_backend: true` in `public/admin/config.yml`, Decap writes project files directly under `content/projects/` (and uploads under `public/uploads/`). You can create, edit, and delete projects without GitHub OAuth.

After saving in the CMS, refresh the Next.js site (or restart `npm run dev` if a new slug was added) so pages pick up the new Markdown.

## Project content

Projects live in `content/projects/*.md`:

```md
---
title: Villa Sunrise
category: Residential        # Residential | Commercial | Interior | Other
location: Ahmedabad
year: 2025
area: 3500 sq ft
featured: true
cover: /uploads/villa-cover.svg
images:
  - /uploads/villa-1.svg
  - /uploads/villa-2.svg
video: https://youtu.be/VIDEO_ID     # optional
---

Description in Markdown...
```

- `featured: true` shows the project on the home page
- Images can be files in `public/uploads/` or external URLs
- Videos are YouTube links (watch or youtu.be); the site embeds them as iframes

## Production build

```bash
npm run build
```

Confirm the `out/` folder contains HTML for home, projects, each slug, about, contact, admin, sitemap, and robots.

## Deploy to Cloudflare

This is a **static** Next.js export (`output: "export"` → `out/`). Do **not** use OpenNext.

### Workers (current dashboard flow)

`wrangler.jsonc` already points assets at `./out`. Cloudflare should:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy` (uses `wrangler.jsonc`)

### Classic Pages

1. Push this repository to GitHub.
2. **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node version:** env var `NODE_VERSION` = `22` if needed.
4. Deploy. The site is fully static.

### /admin on the live site (GitHub OAuth)

Local CMS uses `local_backend`. On Cloudflare, Decap needs GitHub login:

1. Create a GitHub OAuth App (Settings → Developer settings → OAuth Apps).
2. Set the callback URL to your Decap OAuth proxy (see [current Decap docs](https://decapcms.org/docs/github-backend/)).
3. Point `public/admin/config.yml` at that proxy (`base_url` / `auth_endpoint` as documented).
4. Set `branch` to the branch Decap should commit to (often `main`).
5. Add the architect’s GitHub account as a **collaborator** on the repo so they can publish.

Until OAuth is configured, use local Decap (`npx decap-server`) to manage content, then commit and push.

## How the architect adds a project

1. Open `/admin/` (local with `decap-server`, or live after OAuth).
2. Choose **Projects** → **New project**.
3. Fill title, category, location, year, optional area, featured flag.
4. Upload a cover and gallery images (stored in `public/uploads/`).
5. Optionally paste a YouTube link.
6. Write the description, then **Publish**.
7. On production: Decap opens a commit/PR on GitHub; after the Cloudflare build finishes, the new project page appears.
8. Locally: files appear under `content/projects/`; run or refresh `npm run dev`, then `npm run build` before deploy.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local Next.js server |
| `npm run build` | Static export to `out/` |
| `npx decap-server` | Local Decap backend |

## Folder map

```
content/projects/          Markdown projects (CMS writes here)
public/admin/              Decap CMS UI + config
public/uploads/            Uploaded images
src/app/                   Pages (home, projects, detail, about, contact)
src/components/            Navbar, Footer, ProjectCard, Gallery, Lightbox, …
src/lib/projects.js        Read + parse Markdown
```
