import openai from "../config/ai.js";

// Controller for AI enhance resume professional summary
// POST => /api/ai/resume-pro-sum

export const enhanceProfessionalSummaryController = async (req, res) => {
    try {
        
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({ message: "Content is required" });
        }

        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL_NAME,
            messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume.The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anthing else." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// controller for enhance resume Job description
// POST => /api/ai/enhance-job-desc
export const enhanceJobDescriptionController = async (req, res) => {
    try {
        
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({ message: "Content is required" });
        }

        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL_NAME,
            messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable result Where possible. Make it ATS-friendly and only return text no options or anthing else." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}