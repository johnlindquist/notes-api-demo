/// <reference types="vitest" />
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrHotReload from 'vite-plugin-ssr-hot-reload'

// Conditionally add Cloudflare plugin only when not running tests
const plugins = process.env.VITEST
  ? [ssrHotReload()]
  : [ssrHotReload(), cloudflare()]

export default defineConfig({
  plugins: plugins,
  // Add the test configuration block
  test: {
    globals: true, // Use Vitest globals (describe, it, expect, etc.) like Jest
    environment: 'node', // Using 'node' environment as 'edge-runtime' caused issues
    // You might need to configure setup files or other options later
  },
})
