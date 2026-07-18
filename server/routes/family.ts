import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth';
import { FamilyController } from '../controllers/family';

const router = new Router();
router.prefix('/family');
router.get('/my', authMiddleware, FamilyController.getMyFamilies);
router.post('/create', authMiddleware, FamilyController.create);
router.get('/invitations', authMiddleware, FamilyController.getMyInvitations);
router.post('/apply', authMiddleware, FamilyController.apply);
export default router;
