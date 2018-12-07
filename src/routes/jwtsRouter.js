const Router = require('koa-router');

const router = new Router();

router.get('/api/jwts', async (ctx) => {
    ctx.body = 'Hello JWTs'
});

router.post('/api/jwts', async (ctx) => {
    ctx.body = ctx.request.body
});

module.exports = router;
