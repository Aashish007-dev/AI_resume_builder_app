import imageKit from "../config/imageKit.js";
import resumeModel from "../models/resume.model.js";

import fs from "fs";


// Create a new resume controllers
// POST => /api/resumes/create
export const createResumeController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware
        const {title} = req.body;

        const newResume = new resumeModel.create({
            userId,
            title,
           
        })

        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: "Server error", error: error.message });
    }
}

// Delete a resume controller
// DELETE => /api/resumes/delete
export const deleteResumeController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware
        const { resumeId } = req.params;

        await resumeModel.findOneAndDelete({ _id: resumeId, userId });

        return res.status(200).json({ message: "Resume deleted successfully" });

    } catch (error) {
        return  res.status(500).json({ message: "Server error", error: error.message });
    }
}
    

// get user resume by user id
// GET => /api/resumes/get
export const getUserResumesByIdController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware
        const {resumeId} = req.params;

        const resume = await resumeModel.findOne({ _id: resumeId, userId });
        if(!resume){
            return res.status(404).json({ message: "Resume not found" });
        }

        resume.__v = undefined; // Exclude __v from response
        resume.createdAt = undefined; // Exclude createdAt from response
        resume.updatedAt = undefined; // Exclude updatedAt from response

        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// get resume by id public
// GET => /api/resumes/public
export const getPublicResumeByIdController = async (req, res) => {
    try {
        const {resumeId} = req.params;
        const resume = await resumeModel.findOne({public: true, _id: resumeId});
        if(!resume){
            return res.status(404).json({ message: "Resume not found" });
        }

         return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: "Server error", error: error.message });
    }
}

// Update resume controller
// PUT => /api/resumes/update
export const updateResumeController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware
        const { resumeId, resumeData, removeBackground } = req.body;

        const image = req.file; // Assuming you're using multer for file uploads

        let resumeDataCopy = JSON.parse(resumeData);

        if(image){
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imageKit.files.upload({
                    file: imageBufferData,
                    fileName: 'resume.png',
                    folder: 'user-resumes',
                    transformation: {
                        pre: 'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ', e-bgremove' : '')
                    }
                    });

            resumeDataCopy.personal_info.image = response.url;

        }

        const updatedResume = await resumeModel.findByIdAndUpdate({userId, _id: resumeId}, resumeDataCopy, { new: true });

        return res.status(200).json({ message: "Resume updated successfully", resume: updatedResume });

    } catch (error) {
        return res.status(400).json({ message: "Server error", error: error.message });
    }
}