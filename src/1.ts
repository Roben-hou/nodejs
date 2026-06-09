import Koa, { Context, Next } from 'koa';

const app = new Koa();

// ctx是上下文, next是下一个中间件
app.use(async (ctx: Context, next: Next) => {
    ctx.body = 'Hello World';
    await next();
});

app.listen(3000, () => {
    console.log('Server running on port 3000 at http://localhost:3000');
});
