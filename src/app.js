const Koa = require('koa');
const BodyParser = require('koa-bodyparser');

const router = require('./routes/jwtsRouter')
const app = module.exports = new Koa();

// middlewares
app.use(BodyParser());
app.use(router.routes())
// app.use(router.allowedMethods())

app.listen(process.env.PORT || 3000);
