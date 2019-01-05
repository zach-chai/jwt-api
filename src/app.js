const Koa = require('koa')
const BodyParser = require('koa-bodyparser')

const indexRouter = require('./routes/indexRouter')
const jwtRouter = require('./routes/jwtsRouter')
const app = new Koa()

// middlewares
app.use(BodyParser())
app.use(jwtRouter.routes())
app.use(indexRouter.routes())
// app.use(router.allowedMethods())

const server = app.listen(process.env.PORT || 3000)

module.exports = server
