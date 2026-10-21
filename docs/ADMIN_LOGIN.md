# Live admin login (Decap + GitHub)

After this setup, open:

**https://architect-portfolio.naitikkaklotar7.workers.dev/admin/**

→ **Login with GitHub** → publish a project → Cloudflare rebuilds the site automatically.

---

## Step 1 — Create a GitHub OAuth App

1. Open [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers) → **New OAuth App**
2. Fill in:

| Field | Value |
|--------|--------|
| Application name | `KK Architect Decap` |
| Homepage URL | `https://architect-portfolio.naitikkaklotar7.workers.dev` |
| Authorization callback URL | `https://architect-decap-oauth.naitikkaklotar7.workers.dev/callback` |

3. Click **Register application**
4. Copy **Client ID**
5. Click **Generate a new client secret** → copy **Client Secret** (save it; shown once)

If you changed your Cloudflare `workers.dev` account subdomain, use that new subdomain in both URLs instead of `naitikkaklotar7`.

---

## Step 2 — Deploy the OAuth proxy Worker

In a terminal:

```bash
cd oauth-proxy
npm install
npx wrangler login
```

Set secrets (paste when prompted):

```bash
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
```

Deploy:

```bash
npx wrangler deploy
```

You should get:  
`https://architect-decap-oauth.naitikkaklotar7.workers.dev`

Visit that URL — it should say the proxy is OK.

---

## Step 3 — Redeploy the portfolio

`public/admin/config.yml` already points at the proxy. After pushing to `main`, Cloudflare rebuilds the site.

Or trigger **Retry deployment** in the Cloudflare dashboard.

---

## Step 4 — Log in

1. Open `/admin/` on the live site  
2. Click **Login with GitHub**  
3. Authorize the app (account must be able to push to `Naitikkaklotar/architect-portfolio`)

---

## Local editing (still works)

```bash
npm run dev
npx decap-server
```

Open http://localhost:3000/admin/ — uses `local_backend` (no GitHub popup).

---

## If login fails

- Callback URL on the OAuth App must be **exactly**  
  `https://architect-decap-oauth.…workers.dev/callback`
- Secrets must be set on the **architect-decap-oauth** Worker (not the portfolio Worker)
- Your GitHub user needs **write** access to the repo
- If you renamed the account subdomain, update `base_url` / `site_url` in `public/admin/config.yml` and the OAuth App URLs
