const request = require('supertest')
const server = require('../../src/app')

afterEach(() => {
  server.close()
})

describe('Not Found Handler', () => {
  it('should return 404 for get request on unhandled route', async () => {
    const res = await request(server).get('/not_found_get')
    expect(res.status).toEqual(404)
    expect(res.body.message).toEqual('Not Found')
  })
  it('should return 404 for post request on unhandled route', async () => {
    const res = await request(server).post('/not_found_post').send({ data: 'data' })
    expect(res.status).toEqual(404)
    expect(res.body.message).toEqual('Not Found')
  })
})
