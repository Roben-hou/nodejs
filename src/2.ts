import Koa, { Context, Next } from 'koa';
const app = new Koa();
app.use(async (ctx: Context, next: Next) => {
    console.log(ctx)
    console.log(ctx.request)
    ctx.body = 'hello world'
    await next()
})
app.listen(3000, () => {
    console.log('Server running on port 3000 at http://localhost:3000');
});    