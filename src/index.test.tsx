// src/index.test.tsx
import { describe, it, expect } from 'vitest'
import app from './index' // Import your Hono app instance

describe('GET /', () => {
  it('should return Hello!', async () => {
    // Hono apps have a .request method for testing
    const res = await app.request('/')

    // Assert status code
    expect(res.status).toBe(200)

    // Assert response body content
    const text = await res.text()
    expect(text).toContain('<h1>Hello!</h1>')

    // Optional: Assert content type if needed
    // expect(res.headers.get('Content-Type')).toMatch(/text\/html/)
  })

  it('should handle non-existent route', async () => {
     const res = await app.request('/non-existent-route')
     expect(res.status).toBe(404) // Hono's default for not found
  })
})

// You can add more describe blocks for other routes or components 