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
    ctx.throw(422) // TODO return error message
  }

  const data = ctx.request.body.data
  if (data.key == null) {
    ctx.throw(422) // TODO return error message
  }

  let jwtOptions = {
      algorithm: data.alg,

      issuer: data.iss,
      audience: data.aud
  }

  if (data.sub != null) {
    jwtOptions.subject = data.sub
  }
  if (data.kid != null) {
    jwtOptions.keyid = data.kid
  }

  let jwtPayload = data.payload || {}
  jwtPayload.exp = data.exp
  if (data.jti != null) {
    jwtPayload.jwtid = data.jti
  }

  let jwtKey = data.key

  let token = jwt.sign(jwtPayload, jwtKey, jwtOptions)

  ctx.body = {
    data: token
  }
})

module.exports = router
