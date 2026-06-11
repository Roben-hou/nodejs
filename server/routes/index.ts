import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx, next) => {
  await (ctx as any).render('index', {
    title: 'Hello Koa 2222!'
  });
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 stringsss';
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
});

export default router;
