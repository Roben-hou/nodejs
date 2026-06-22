import Router from 'koa-router';
import { RecordController } from '../controllers/records'
import { authMiddleware } from '../middlewares/auth'



const router = new Router();

router.prefix('/records');

router.get('/', authMiddleware, RecordController.getList)
router.post('/create', authMiddleware,RecordController.create)
router.get('/stats',authMiddleware, RecordController.getStats)
router.delete('/:id', RecordController.delete)

export default router;