const acceptHandler = () => {
  return async (ctx, next) => {
    if (!ctx.accepts('json')) {
      ctx.throw(406, 'JSON support only')
    }
    // force JSON for 3rd party middleware support
    ctx.headers['accept'] = 'application/json'
    await next()
  }
}

module.exports = acceptHandler
