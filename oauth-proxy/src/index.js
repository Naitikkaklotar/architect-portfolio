/**
 * Decap CMS GitHub OAuth proxy (Cloudflare Worker).
 * Handles /auth and /callback so the CMS can log in with GitHub.
 */

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function authorizeURL({ clientId, redirectUri, scope, state }) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

async function exchangeCode({ clientId, clientSecret, code, redirectUri }) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const json = await response.json();
  if (!json.access_token) {
    throw new Error(json.error_description || json.error || "Token exchange failed");
  }
  return json.access_token;
}

function callbackHtml(status, content) {
  // Embed as a JS string literal: authorization:github:success:{...}
  const authMessage = JSON.stringify(
    `authorization:github:${status}:${JSON.stringify(content)}`
  );
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Authorizing Decap…</title></head>
  <body>
    <p>Authorizing Decap… you can close this window if it stays open.</p>
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
          // Reply to the opener's handshake with the exact origin Decap expects
          send(event.origin || "*");
          window.removeEventListener("message", receiveMessage, false);
          try { window.close(); } catch (e) {}
        }

        window.addEventListener("message", receiveMessage, false);

        // Start Decap handshake
        if (window.opener) {
          window.opener.postMessage("authorizing:github", "*");
        }

        // Fallback: some Decap builds never complete the handshake across workers.dev
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectUri = `https://${url.hostname}/callback`;

    if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
      return new Response(
        "OAuth not configured. Set GITHUB_OAUTH_ID and GITHUB_OAUTH_SECRET secrets.",
        { status: 500 }
      );
    }

    if (url.pathname === "/auth") {
      const provider = url.searchParams.get("provider");
      if (provider && provider !== "github") {
        return new Response("Invalid provider", { status: 400 });
      }

      const privateRepo =
        env.GITHUB_REPO_PRIVATE !== undefined && env.GITHUB_REPO_PRIVATE !== "0";
      const scope = privateRepo ? "repo user" : "public_repo user";

      const authorizationUri = authorizeURL({
        clientId: env.GITHUB_OAUTH_ID,
        redirectUri,
        scope,
        state: randomHex(8),
      });

      return Response.redirect(authorizationUri, 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }

      try {
        const accessToken = await exchangeCode({
          clientId: env.GITHUB_OAUTH_ID,
          clientSecret: env.GITHUB_OAUTH_SECRET,
          code,
          redirectUri,
        });
        return new Response(
          callbackHtml("success", { token: accessToken, provider: "github" }),
          { headers: { "Content-Type": "text/html;charset=UTF-8" } }
        );
      } catch (err) {
        return new Response(
          callbackHtml("error", {
            error: String(err.message || err),
            provider: "github",
          }),
          {
            status: 400,
            headers: { "Content-Type": "text/html;charset=UTF-8" },
          }
        );
      }
    }

    return new Response("Decap OAuth proxy OK. Use /auth from the CMS.", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
