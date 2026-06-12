import Router from 'koa-router';
import { Next } from 'koa';

const router = new Router();

router.prefix('/posts');

router.get('/', async (ctx, next: Next) => {
    const category = ctx.query.category
    ctx.body = {
    category,
    }
});
router.get('/:id', async (ctx, next: Next) => {
  const id = ctx.params.id
  ctx.body = {
    id,
  }
})
router.post('/create', async (ctx, next: Next) => { 
    const {title,content,category}=ctx.request.body as {title:string,content:string,category:string};
    ctx.body = {
      title,
      content,
      category,
      message:'创建成功'
    }
})
  

export default router;