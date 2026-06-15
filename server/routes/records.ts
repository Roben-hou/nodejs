import Router from 'koa-router';
import { RecordController } from '../controllers/records'

const router = new Router();

router.prefix('/records');

router.get('/', RecordController.getList);
router.post('/create', RecordController.create)
router.delete('/:id', RecordController.delete)