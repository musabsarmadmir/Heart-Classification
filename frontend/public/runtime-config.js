// This file is served statically and can be replaced without rebuilding the React bundle.
// Adjust API_BASE at deploy time (e.g. via Render/Vercel rewrite or file replacement).
window.__RUNTIME_CONFIG__ = {
  API_BASE: window.RUNTIME_API_BASE_OVERRIDE || 'https://api.example.com'
};
