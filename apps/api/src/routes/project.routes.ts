import { Router } from 'express';
import { listProjects, triggerBackup } from '../controllers/project.controller';

const router = Router();

router.get('/', listProjects);
router.post('/:id/trigger', triggerBackup);

export default router;
