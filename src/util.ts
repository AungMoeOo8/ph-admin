import { refreshAccessToken, Token } from "./features/wordpress/auth.service";

export function createFetchFactory() {
  let token: Token | null = null
  let refreshingPromise: Promise<void> | null = null

  function isTokenExpired() {
    if (!token) return true
    const now = Date.now()
    const expiry = token.accessExpiry * 1000;
    return expiry - now < 60 * 1000
  }

  function getToken() {
    return token
  }

  function setToken(newToken: Token) {
    token = newToken
  }

  function clearToken() {
    token = null
  }

  async function refreshAccessTokenAndExpiry() {
    // Avoid duplicate refreshes
    if (!refreshingPromise) {
      refreshingPromise = (async () => {
        const newToken = await refreshAccessToken()
        token = newToken
        refreshingPromise = null
      })()
    }
    await refreshingPromise
  }

  async function createFetch(input: URL | RequestInfo, init?: RequestInit) {

    // refresh if token expiration is close.
    if (isTokenExpired()) {
      await refreshAccessTokenAndExpiry()
    }

    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        "Authorization": `Bearer ${token!.accessToken}`
      }
    })
  }

  return { getToken, setToken, clearToken, createFetch, refreshAccessTokenAndExpiry }
}