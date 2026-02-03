import express from "express";
import protect from '../middlewares/auth.middleware.js';
import { createResumeController, deleteResumeController, getPublicResumeByIdController, getUserResumesByIdController, updateResumeController } from "../controllers/resume.controller.js";
import upload from "../config/multer.js";


const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResumeController);
resumeRouter.put('/update', upload.single('image'), protect, updateResumeController);
resumeRouter.delete('/delete/:resumeId', protect, deleteResumeController);
resumeRouter.get('/get/:resumeId', protect, getUserResumesByIdController);
resumeRouter.get('/public/:resumeId', getPublicResumeByIdController);


export default resumeRouter;
