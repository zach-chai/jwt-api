const Router = require('koa-router')

const APP_URL = process.env.APP_URL || ''
const router = new Router()

router.get('/', async (ctx) => {
    ctx.body = {
      sign_jwt_url: `POST ${APP_URL}/api/jwts/sign`,
      decode_jwt_url: `POST ${APP_URL}/api/jwts/decode`
    }
})

module.exports = router
