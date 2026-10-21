# Auto-deploy after admin Publish

When you **Publish** in `/admin/`, Decap commits to GitHub `main`.  
GitHub Actions then builds and deploys to Cloudflare automatically.

## One-time setup (GitHub secrets)

### 1. Cloudflare Account ID

Already known for this project:

```
f7e1126d788c589e8a9f0777e55639d1
```

### 2. Create a Cloudflare API token

1. Open [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → use template **Edit Cloudflare Workers**  
   (or custom: Account → Workers Scripts → Edit, Account → Account Settings → Read)
3. Create → **copy the token** (shown once)

### 3. Add secrets on GitHub

1. Open https://github.com/Naitikkaklotar/architect-portfolio/settings/secrets/actions
2. **New repository secret**:

| Name | Value |
|------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | `f7e1126d788c589e8a9f0777e55639d1` |
| `CLOUDFLARE_API_TOKEN` | *(paste the token from step 2)* |

### 4. Confirm

After secrets are saved, push any commit to `main` (or **Actions** → **Deploy to Cloudflare** → **Run workflow**).

Check: https://github.com/Naitikkaklotar/architect-portfolio/actions

---

## Flow after setup

1. Edit in `/admin/` → **Publish**
2. GitHub gets a commit on `main`
3. Action runs: `npm ci` → `npm run build` → `wrangler deploy`
4. Live site updates in a few minutes
