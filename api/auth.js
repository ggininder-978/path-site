// api/auth.js — Self-hosted GitHub OAuth Proxy for Decap CMS
//
// This Vercel serverless function implements the GitHub OAuth flow so that
// Decap CMS at /admin/ can authenticate without any third-party service.
//
// Setup steps (one-time):
//   1. Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
//   2. Application name: PATH CMS
//   3. Homepage URL: https://YOUR-VERCEL-DOMAIN.vercel.app
//   4. Authorization callback URL: https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth
//   5. After creating, copy the Client ID and generate a Client Secret
//   6. In Vercel dashboard → Project → Settings → Environment Variables, add:
//        GITHUB_CLIENT_ID     = (your Client ID)
//        GITHUB_CLIENT_SECRET = (your Client Secret)
//   7. In public/admin/config.yml, set base_url to your Vercel project URL
//
// Reference pattern: https://github.com/sveltia/sveltia-cms-auth (MIT License)
// This is a lightweight reimplementation of the same OAuth handshake.

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default async function handler(req, res) {
  const { code, state } = req.query || {};

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send(
      renderMessage('error', 'OAuth 環境變數未設定。請確認 GITHUB_CLIENT_ID 與 GITHUB_CLIENT_SECRET 已加入 Vercel 環境變數。')
    );
  }

  // Step 1: No code yet → redirect to GitHub authorization page
  if (!code) {
    const params = new URLSearchParams({
      client_id: clientId,
      scope: 'repo,user',
      state: state || '',
    });
    return res.redirect(`${GITHUB_OAUTH_URL}?${params.toString()}`);
  }

  // Step 2: GitHub redirected back with a code → exchange for access token
  try {
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return res.status(400).send(
        renderMessage('error', `GitHub OAuth 錯誤：${tokenData.error_description || tokenData.error}`)
      );
    }

    // Step 3: Send token back to Decap CMS via postMessage (standard Decap handshake)
    const content = JSON.stringify({
      token: tokenData.access_token,
      provider: 'github',
    });

    return res.status(200).send(renderMessage('success', content));

  } catch (err) {
    return res.status(500).send(
      renderMessage('error', `伺服器錯誤：${err.message}`)
    );
  }
}

// Renders an HTML page that posts a message to the opener window (Decap CMS standard)
function renderMessage(status, content) {
  const message = JSON.stringify({ status, content });
  return `<!doctype html>
<html lang="zh-TW">
<head><meta charset="utf-8" /><title>CMS 驗證</title></head>
<body>
<script>
  (function() {
    // Send result to the Decap CMS window that opened this popup
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:${status === 'success' ? 'success' : 'error'}:${status === 'success' ? '' + JSON.stringify({ token: JSON.parse(content)?.token, provider: 'github' }) : content}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage);
    window.opener.postMessage('authorizing:github', '*');
  })();
<\/script>
</body>
</html>`;
}
