import Koa from 'koa';
import views from 'koa-views';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import koaStatic from 'koa-static';

import index from './routes/index';
import users from './routes/users';
import posts from './routes/post';
import records from './routes/records';
import auth from './routes/auth';

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(koaStatic(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes 
app.use(async (ctx, next) => {
  await next()
  const data = ctx.body;
  ctx.body = {
    code: 200,
    message: 'success',
    data: data
  }
})
app.use(index.routes());
app.use(index.allowedMethods());
app.use(users.routes());
app.use(users.allowedMethods());
app.use(posts.routes());
app.use(posts.allowedMethods());
app.use(records.routes());
app.use(records.allowedMethods());
app.use(auth.routes());
app.use(auth.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

export default app;
