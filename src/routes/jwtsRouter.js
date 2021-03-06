const _ = require('lodash')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const router = new Router()

router.prefix('/api/jwts')

router.get('/', async (ctx) => {
    ctx.body = {
      data: []
    }
})

router.post('/sign', async (ctx) => {
  if (ctx.request.body == null || Object.keys(ctx.request.body).length === 0) {
    ctx.throw(422, 'request body is null or empty')
  }
  const data = ctx.request.body.data

  if (!data.key) {
    ctx.throw(422, 'data.key is not set')
  }
  if (!data.alg) {
    ctx.throw(422, 'data.alg is not set')
  }

  let token = signToken(data)

  ctx.body = {
    data: token
  }
})

router.post('/decode', async (ctx) => {
  if (_.isEmpty(ctx.request.body.data)) {
    ctx.throw(422, 'data is empty or missing')
  }
  const data = ctx.request.body.data

  const { header, payload } = jwt.decode(data.token, { complete: true })

  ctx.body = {
    data: {
      header,
      payload
    }
  }
})

router.post('/resign', async (ctx) => {
  if (_.isEmpty(ctx.request.body.data)) {
    ctx.throw(422, 'data is empty or missing')
  }
  const data = ctx.request.body.data

  if (!data.key) {
    ctx.throw(422, 'data.key is not set')
  }

  const { header, payload } = jwt.decode(data.token, { complete: true })

  let tokenData = Object.assign(
    _.pick(header, ['alg', 'kid']),
    _.pick(payload, ['iss', 'aud', 'jti', 'exp', 'nbf', 'iat']),
    { payload: _.omit(payload, ['iss', 'aud', 'jti', 'exp', 'nbf', 'iat']) },
    { key: _.get(data, 'key') }
  )

  tokenData = _.merge(tokenData, data.overwrite)

  const token = signToken(tokenData)

  ctx.body = {
    data: token
  }
})

const signToken = data => {
  let jwtOptions = {
    algorithm: data.alg,
    issuer: data.iss,
    audience: data.aud,
    subject: data.sub,
    jwtid: data.jti,
    keyid: data.kid
  }
  jwtOptions = _.omitBy(jwtOptions, _.isUndefined)

  let jwtPayload = data.payload || {}
  Object.assign(jwtPayload, {
    iat: data.iat,
    exp: data.exp,
    nbf: data.nbf
  })
  jwtPayload = _.omitBy(jwtPayload, _.isUndefined)

  return jwt.sign(jwtPayload, data.key, jwtOptions)
}

module.exports = router
