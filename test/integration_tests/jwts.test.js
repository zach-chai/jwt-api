const path = require('path')
const fs = require('fs')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const server = require('../../src/app')
const CONTENT_TYPE = 'application/json'

const HEADER_FIELDS = ['typ', 'alg', 'kid']
const VALID_FIELDS = ['typ', 'alg', 'key', 'iss', 'aud', 'sub', 'jti', 'kid', 'iat', 'exp', 'nbf', 'payload']
let ecdsaPrivateKey, ecdsaPublicKey, req, response
beforeAll(() => {
  ecdsaPublicKey = fs.readFileSync(path.resolve(__dirname, '../fixtures/id_ecdsa.pub'), 'utf8')
  ecdsaPrivateKey = fs.readFileSync(path.resolve(__dirname, '../fixtures/id_ecdsa'), 'utf8')
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

    const buildPayload = ({ omit = [], pick = VALID_FIELDS } = {}) => {
      return {
        data: _.pick(_.omit({
          typ: 'JWT',
          alg: 'ES384',
          key: ecdsaPrivateKey,
          iss: 'issuer',
          aud: 'audience',
          sub: 'subject',
          jti: 'jwt_id',
          kid: 'key_id',
          iat: 1549134500,
          exp: 1645424225,
          nbf: 1545424225,
          payload: {
            info: 'info'
          }
        }, omit), pick)
      }
    }

    const buildVerifyOpts = (omit = []) => {
      return {
        data: _.omit({
          algorithms: ['ES384'],
          issuer: 'issuer',
          audience: 'audience',
          sub: 'subject'
        }, omit)
      }
    }

    test('should sign correct header and claims', async () => {
      const res = await req({ body: buildPayload() })
      expect(res.status).toEqual(200)

      const decoded = jwt.decode(res.body.data, { complete: true })
      expect(decoded.header).toEqual(buildPayload({ pick: HEADER_FIELDS }).data)
      expect(_.omit(decoded.payload, 'info')).toEqual(
        buildPayload({ omit: HEADER_FIELDS.concat(['payload', 'key']) }).data
      )
    })

    test('should sign correct signature and payload', async () => {
      const res = await req({ body: buildPayload() })
      expect(res.status).toEqual(200)

      const decodedPayload = jwt.verify(res.body.data, ecdsaPublicKey, buildVerifyOpts())
      expect(decodedPayload.info).toEqual('info')
    })

    test('should return 422 for missing body', async () => {
      const res = await req({ body: {} })
      expect(res.status).toEqual(422)
      expect(res.body.message).toEqual('request body is null or empty')
    })

    test('should return 422 for missing key', async () => {
      const res = await req({ body: buildPayload({ omit: ['key'] }) })
      expect(res.status).toEqual(422)
      expect(res.body.message).toEqual('data.key is not set')
    })

    test('should not require optional properties', async () => {
      const res = await req({ body: buildPayload({ pick: ['alg', 'key'] }) })
      expect(res.status).toEqual(200)
      const decodedPayload = jwt.verify(res.body.data, ecdsaPublicKey)
      expect(_.omit(decodedPayload.payload, 'iat')).toEqual({})
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
