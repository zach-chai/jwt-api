const path = require('path')
const fs = require('fs')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const server = require('../src/app')
const CONTENT_TYPE = 'application/json'

let ecdsaPrivateKey, ecdsaPublicKey, req, method, endpoint, response
beforeAll(() => {
  ecdsaPublicKey = fs.readFileSync(path.resolve(__dirname, './fixtures/id_ecdsa.pub'), 'utf8')
  ecdsaPrivateKey = fs.readFileSync(path.resolve(__dirname, './fixtures/id_ecdsa'), 'utf8')
})
afterEach(() => {
  server.close()
})

describe('JWTs', () => {
  const RESOURCE_PATH = '/api/jwts'

  beforeEach(() => {
    response = null
  })
  afterEach(() => {
    expect(response.type).toEqual(CONTENT_TYPE)
  })

  describe(`GET ${RESOURCE_PATH}`, () => {
    beforeAll(() => {
      reqSetup('get', `${RESOURCE_PATH}`)
    })

    test("should return jwts", async () => {
      const res = await req()
      expect(res.status).toEqual(200)
      expect(res.body).toEqual({ data: [] })
    })
  })

  describe(`POST ${RESOURCE_PATH}/sign`, () => {
    beforeAll(() => {
      reqSetup('post', `${RESOURCE_PATH}/sign`)
    })

    const buildData = (omit = []) => {
      return {
        data: _.omit({
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
        }, omit)
      }
    }

    test('should sign and return a jwt', async () => {
      const opts = {
        algorithms: ['ES384'],
        audience: 'audience',
        issuer: 'issuer',
        subject: 'subject'
      }

      const res = await req({ body: buildData() })
      expect(res.status).toEqual(200)

      const decodedPayload = jwt.verify(res.body.data, ecdsaPublicKey, opts)
      expect(decodedPayload.info).toEqual('info')
    })

    test('should return 422 for missing body', async () => {
      const res = await req({ body: {} })
      expect(res.status).toEqual(422)
      expect(res.body.message).toEqual('request body is null or empty')
    })

    test('should return 422 for missing key', async () => {
      const res = await req({ body: buildData(['key']) })
      expect(res.status).toEqual(422)
      expect(res.body.message).toEqual('data.key is not set')
    })
  })
})

const defaultOptions = Object.freeze({
  accept: CONTENT_TYPE
})

function reqSetup(method, endpoint) {
  this.endpoint = endpoint
  this.method = method
  req = send.bind(this)
}

async function send(opts = {}) {
  opts = Object.assign(_.cloneDeep(defaultOptions), opts)
  if (this.method === 'get') {
    response = await request(server).get(this.endpoint)
  } else {
    response = await request(server).post(this.endpoint)
                                .send(opts.body)
                                .set('Accept', opts.accept)
  }
  return response
}
