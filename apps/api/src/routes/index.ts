import { Router } from 'express';
import projectRoutes from './project.routes';

const router = Router();

// Aggregate all feature routes here
router.use('/projects', projectRoutes);

export default router;
