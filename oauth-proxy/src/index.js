/**
 * Decap CMS login proxy (Cloudflare Worker).
 *
 * Live site: username + password form, then the Worker uses a stored GitHub
 * token to let Decap write to the repo. Credentials are Worker secrets, never
 * in git: ADMIN_USER, ADMIN_PASSWORD, GITHUB_TOKEN.
 */

function safeEqual(a, b) {
  const enc = new TextEncoder();
  const left = enc.encode(String(a || ""));
  const right = enc.encode(String(b || ""));
  const len = Math.max(left.length, right.length, 1);
  let diff = left.length ^ right.length;
  for (let i = 0; i < len; i += 1) {
    diff |= (left[i] || 0) ^ (right[i] || 0);
  }
  return diff === 0;
}

async function tooManyAttempts(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = new Request(`https://admin-login-rate.invalid/${encodeURIComponent(ip)}`);
  const cache = caches.default;
  const hit = await cache.match(key);
  const count = hit ? parseInt(await hit.text(), 10) || 0 : 0;
  if (count >= 8) return true;
  await cache.put(
    key,
    new Response(String(count + 1), { headers: { "Cache-Control": "max-age=900" } }),
  );
  return false;
}

function loginPage(error) {
  const message = error
    ? `<p class="err">${error}</p>`
    : `<p class="lead">Enter the site admin username and password.</p>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KK Architect — Admin login</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #faf9f7;
        color: #111;
        font-family: Inter, "Segoe UI", system-ui, sans-serif;
      }
      .card {
        width: min(420px, calc(100vw - 32px));
        background: #fff;
        border: 1px solid rgba(0,0,0,.12);
        padding: 36px 32px 32px;
      }
      h1 {
        margin: 0 0 6px;
        font-family: "EB Garamond", Georgia, serif;
        font-weight: 500;
        font-size: 32px;
      }
      .sub {
        margin: 0 0 24px;
        font-size: 12px;
        letter-spacing: .16em;
        text-transform: uppercase;
        color: #8a8a8a;
      }
      .lead, .err { font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
      .err { color: #b42318; }
      label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: .08em;
        text-transform: uppercase;
        margin: 0 0 6px;
      }
      input {
        width: 100%;
        min-height: 44px;
        margin: 0 0 16px;
        padding: 10px 12px;
        border: 1px solid rgba(0,0,0,.28);
        border-radius: 2px;
        font-size: 16px;
      }
      button {
        width: 100%;
        min-height: 44px;
        margin-top: 8px;
        background: #111;
        color: #fff;
        border: 0;
        font-size: 13px;
        letter-spacing: .1em;
        text-transform: uppercase;
        cursor: pointer;
      }
      button:hover { background: #333; }
    </style>
  </head>
  <body>
    <form class="card" method="post" action="/login" autocomplete="on">
      <p class="sub">Site admin</p>
      <h1>KK Architect</h1>
      ${message}
      <label for="user">Username</label>
      <input id="user" name="user" type="text" autocomplete="username" required />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required />
      <button type="submit">Log in</button>
    </form>
  </body>
</html>`;
}

function callbackHtml(status, content) {
  const authMessage = JSON.stringify(
    `authorization:github:${status}:${JSON.stringify(content)}`,
  );
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Authorizing Decap…</title></head>
  <body>
    <p>Signing you in… you can close this window if it stays open.</p>
    <script>
      (function () {
        var msg = ${authMessage};
        var siteOrigins = [
          "https://architect-portfolio.kkarchitect.workers.dev",
          "http://localhost:3000"
        ];

        function send(target) {
          if (!window.opener) return;
          try {
            window.opener.postMessage(msg, target || "*");
          } catch (e) {}
        }

        function receiveMessage(event) {
          send(event.origin || "*");
          window.removeEventListener("message", receiveMessage, false);
          try { window.close(); } catch (e) {}
        }

        window.addEventListener("message", receiveMessage, false);

        if (window.opener) {
          window.opener.postMessage("authorizing:github", "*");
        }

        siteOrigins.forEach(function (origin) { send(origin); });
        send("*");
        setTimeout(function () {
          siteOrigins.forEach(function (origin) { send(origin); });
          send("*");
          try { window.close(); } catch (e) {}
        }, 300);
      })();
    </script>
  </body>
</html>`;
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return new Response("KK Architect admin login. Open /admin on the website.", {
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
      });
    }

    if (url.pathname === "/auth") {
      const provider = url.searchParams.get("provider");
      if (provider && provider !== "github") {
        return new Response("Invalid provider", { status: 400 });
      }
      if (!env.ADMIN_USER || !env.ADMIN_PASSWORD || !env.GITHUB_TOKEN) {
        return html(
          loginPage(
            "Login is not set up yet. Set ADMIN_USER, ADMIN_PASSWORD and GITHUB_TOKEN on this Worker.",
          ),
          500,
        );
      }
      return html(loginPage(""));
    }

    if (url.pathname === "/login" && request.method === "POST") {
      if (!env.ADMIN_USER || !env.ADMIN_PASSWORD || !env.GITHUB_TOKEN) {
        return html(loginPage("Login is not set up yet."), 500);
      }
      if (await tooManyAttempts(request)) {
        return html(loginPage("Too many tries. Wait 15 minutes and try again."), 429);
      }

      const form = await request.formData();
      const user = String(form.get("user") || "");
      const password = String(form.get("password") || "");
      const ok = safeEqual(user, env.ADMIN_USER) && safeEqual(password, env.ADMIN_PASSWORD);

      if (!ok) {
        return html(loginPage("Username or password is wrong."), 401);
      }

      return html(
        callbackHtml("success", { token: env.GITHUB_TOKEN, provider: "github" }),
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
