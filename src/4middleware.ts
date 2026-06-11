import Koa, { Context, Next } from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

const middleware1 =async function (ctx: Context, next: Next) {
    console.log('this is middleware');
    console.log(ctx.request.path);
    await next();
}
const middleware2 =async function (ctx: Context, next: Next) {
    console.log('this is middleware2');
    console.log(ctx.request.path);
    await next();
    console.log('m2')
}
const middleware3 =async function (ctx: Context, next: Next) {
    console.log('this is middleware3');
    console.log(ctx.request.path);
    await next();
    console.log('m3')
}

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
app.listen(3000, () => {
    console.log('Server running on port 3000 at http://localhost:3000');
});
