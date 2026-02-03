import express from 'express';
import { getUserByIdController, getUserResumesController, loginUserController, registerUserController } from '../controllers/user.controller.js';
import protect from '../middlewares/auth.middleware.js';


const router = express.Router();



router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/data', protect ,getUserByIdController) 

router.get('/resumes', protect, getUserResumesController);

export default router;