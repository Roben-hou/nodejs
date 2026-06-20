import Router from 'koa-router';
import { AuthController } from '../controllers/auth'

const router = new Router();

router.prefix('/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login)

export default router;