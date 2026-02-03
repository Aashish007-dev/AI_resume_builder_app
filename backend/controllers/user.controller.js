import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import resumeModel from "../models/resume.model.js";


// Controller for user registration
// POST => /api/users/register
export const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        newUser.password = undefined; // Exclude password from response

        return res.status(201).json({ message: "User registered successfully", token, user: newUser });
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Controller for user login
// POST => /api/users/login

export const loginUserController = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if(!user){

        }

        const isPasswordValid = await bcrypt.compare(password. user.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = undefined; // Exclude password from response

        return res.status(200).json({ message: "Login successful", token, user });
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Controller for getting user by ID
// GET => /api/users/data
export const getUserByIdController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware

        const user = await userModel.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


// Controller for getting user resume
// GET => /api/users/resumes

export const getUserResumesController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set in req by authentication middleware
        const resumes = await resumeModel.find({userId});
        return res.status(200).json({ resumes });
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}