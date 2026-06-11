import Koa, { Context, Next } from 'koa';
import Router from '@koa/router';

const app = new Koa()
const router = new Router()

router.get('/', async(ctx: Context, next: Next) => {
    console.log(ctx)
    console.log(ctx.request)
    ctx.body = 'hello world'
    await next()
})
router.get('/api', async (ctx: Context, next: Next) => {
    console.log(ctx)
    console.log(ctx.request)
    ctx.body = 'hello api'
    await next()
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
    console.log('Server running on port 3000 at http://localhost:3000');
});