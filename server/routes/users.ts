import Router from 'koa-router';
import { Next } from 'koa';

const router = new Router();

router.prefix('/users');

router.get('/', async (ctx, next: Next) => {
  ctx.body = 'this is a users response!';
});
router.get('/info', async (ctx, next: Next) => {
  const id = ctx.query.id
  ctx.body = {
    id: id,
    name: '致秋'
  }
})
router.get('/:id', async (ctx, next: Next) => {
  const id = ctx.params.id
  ctx.body = {
    id: id,
    name: '致秋'
  }
});
router.post('/create', async (ctx, next: Next) => {
  const { age = '', name = '' } = ctx.request.body as { age: number, name: string }
  ctx.body = {
    age,
    name,
    message: '创建成功'
  }
});
router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response';
});

export default router;
