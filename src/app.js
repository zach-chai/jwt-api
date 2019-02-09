const Koa = require('koa')
const BodyParser = require('koa-bodyparser')
const errorHandler = require('koa-better-error-handler')
const notFoundHandler = require('koa-404-handler')

const acceptHandler = require('./middlewares/accepts')
const indexRouter = require('./routes/indexRouter')
const jwtRouter = require('./routes/jwtsRouter')
const app = new Koa()

app.context.onerror = errorHandler
app.context.api = true

// middlewares
app.use(acceptHandler())
app.use(notFoundHandler)
app.use(BodyParser())
app.use(jwtRouter.routes())
app.use(indexRouter.routes())
// app.use(indexRouter.allowedMethods())

const server = app.listen(process.env.PORT || 3000)

module.exports = server
