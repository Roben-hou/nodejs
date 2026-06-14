import Router from 'koa-router';
import { PostController } from '../controllers/post'

const router = new Router();

router.prefix('/posts');

router.get('/', PostController.getList);
router.get('/:id', PostController.getDetail)
router.post('/create', PostController.create)
router.delete('/:id', PostController.delete)

export default router;