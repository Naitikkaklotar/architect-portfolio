# Live admin login (username + password)

Open:

**https://architect-portfolio.kkarchitect.workers.dev/admin/**

→ **Log in** → a small window asks for the site username and password → Publish as usual.

The password is **not** stored in the website files. It lives as a Cloudflare Worker secret. Behind the scenes the Worker uses a GitHub token to save changes to the repo.

---

## One-time setup

### 1. Create a GitHub token

1. Open [GitHub → Fine-grained tokens](https://github.com/settings/personal-access-tokens)
2. **Generate new token**
3. Token name: `KK Architect admin`
4. Repository access: **Only select repositories** → `Naitikkaklotar/architect-portfolio`
5. Permissions → Repository → **Contents: Read and write**
6. Generate and copy the token (shown once)

A classic token with the `public_repo` scope also works if the repo stays public.

### 2. Put the secrets on the login Worker

In a terminal (do **not** paste these into chat):

```bash
cd oauth-proxy
npx wrangler secret put ADMIN_USER
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put GITHUB_TOKEN
```

Pick a username and a long password. The GitHub token is the one from step 1.

### 3. Deploy the login Worker

```bash
cd oauth-proxy
npx wrangler deploy
```

You should get: `https://architect-decap-oauth.kkarchitect.workers.dev`

### 4. Redeploy the portfolio

Push to `main` (or wait for the GitHub Action). Then open `/admin/` and click **Log in**.

---

## Change the password later

```bash
cd oauth-proxy
npx wrangler secret put ADMIN_PASSWORD
```

No site rebuild is needed. The new password works on the next login.

---

## Local editing (no password)

```bash
npm run dev
npx decap-server
```

Open http://localhost:3000/admin/ — uses `local_backend` (no login popup).

---

## If login fails

- Secrets must be set on the **architect-decap-oauth** Worker (not the portfolio Worker)
- After 8 wrong tries from the same network, wait 15 minutes
- The GitHub token must be able to write to `Naitikkaklotar/architect-portfolio`
- If the popup stays blank, allow pop-ups for the site
