const path = require('path')
const fs = require('fs')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const server = require('../src/app')

let ecdsaPrivateKey, ecdsaPublicKey
beforeAll(() => {
  ecdsaPublicKey = fs.readFileSync(path.resolve(__dirname, './fixtures/id_ecdsa.pub'), 'utf8')
  ecdsaPrivateKey = fs.readFileSync(path.resolve(__dirname, './fixtures/id_ecdsa'), 'utf8')
})
afterEach(() => {
  server.close()
})
describe('JWTs', () => {
  const RESOURCE_ENDPOINT = '/api/jwts'
  const CONTENT_TYPE = 'application/json'


  describe(`GET ${RESOURCE_ENDPOINT}`, () => {
    test("should return jwts", async () => {
      const res = await request(server).get(RESOURCE_ENDPOINT)
      expect(res.status).toEqual(200)
      expect(res.type).toEqual(CONTENT_TYPE)
      expect(res.body).toEqual({ data: [] })
    })
  })

  describe(`POST ${RESOURCE_ENDPOINT}/sign`, () => {
    test('should sign and return a jwt', async () => {
      const opts = {
        algorithms: ['ES384'],
        audience: 'audience',
        issuer: 'issuer',
        subject: 'subject'
      }
      const data = {
        data: {
          alg: 'ES384',
          key: ecdsaPrivateKey,
          iss: 'issuer',
          aud: 'audience',
          exp: 1645424225,
          kid: 'key_id',
          sub: 'subject',
          payload: {
            info: 'info'
          }
        }
      }

      const res = await request(server).post(`${RESOURCE_ENDPOINT}/sign`)
                                       .send(data)
      expect(res.status).toEqual(200)
      expect(res.type).toEqual(CONTENT_TYPE)

      const decodedPayload = jwt.verify(res.body.data, ecdsaPublicKey, opts)

      expect(decodedPayload.info).toEqual('info')
    })

    test('should return 422 for missing body', async () => {
      const res = await request(server).post(`${RESOURCE_ENDPOINT}/sign`)
                                       .send({})
      expect(res.status).toEqual(422)
    })
  })
})
