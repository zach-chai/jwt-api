const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = module.exports = new Koa();

// middlewares
app.use(bodyParser());

// response
app.use(async ctx => {
  ctx.body = ctx.request.body;
});

app.listen(3000);
