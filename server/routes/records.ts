import Router from 'koa-router';
import { RecordController } from '../controllers/records'

const router = new Router();

router.prefix('/records');

router.get('/', RecordController.getList);
router.post('/create', RecordController.create)
router.get('/stats', RecordController.getStats)
router.delete('/:id', RecordController.delete)
export default router;