import Router from 'koa-router';
import { RecordController } from '../controllers/records'
import { authMiddleware } from '../middlewares/auth'



const router = new Router();

router.prefix('/records');

router.get('/', authMiddleware, RecordController.getList)
router.post('/create', RecordController.create)
router.get('/stats', RecordController.getStats)
router.delete('/:id', RecordController.delete)
export default router;