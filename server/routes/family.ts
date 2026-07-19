import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth';
import { FamilyController } from '../controllers/family';

const router = new Router();
router.prefix('/family');
router.get('/my', authMiddleware, FamilyController.getMyFamilies);
router.post('/create', authMiddleware, FamilyController.create);
router.get('/invitations', authMiddleware, FamilyController.getMyInvitations);
router.post('/apply', authMiddleware, FamilyController.apply);
router.post('/:id/invite', authMiddleware, FamilyController.invite);
router.put('/accept/:id', authMiddleware, FamilyController.requestJoin);
router.put('/acceptInvite/:id', authMiddleware, FamilyController.acceptInvite);
router.put('/reject/:id', authMiddleware, FamilyController.rejectRequest);
export default router;
