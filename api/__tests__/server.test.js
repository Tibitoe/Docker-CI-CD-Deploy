import request from 'supertest'
import app from '../server.js'

describe('GET /', () => {
  it('responds with 200', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
  })

  it('returns API is running message', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ message: 'API is running' })
  })
})
