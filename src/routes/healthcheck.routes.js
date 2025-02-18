import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"

const router = Router();

/**
 * @swagger
 * /api/healthcheck:
 *   get:
 *     summary: Health check
 *     description: Check if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 */
router.route('/').get(healthcheck);

export default router