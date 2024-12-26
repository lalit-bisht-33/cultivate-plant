import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import User from "../models/User.model.js"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const register =async(req,res)=>{
    const {name,email,password}=req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValidate= emailRegex.test(email);
try {
    
        if(!name || !email ||!password){
            return res.status(400).json({message:"Please enter all fields!!"})
        }
    
        if(!emailValidate){
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
    
        const existingEmail=await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({ message: 'Email already registered!!' });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(password,salt);

        const user=new User({
            name,
            email,
            password:hashPassword,
        })

        if(user){
        await user.save();
        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            plants:user.plants,
            
        });
        }
        else{
            return res.status(400).json({error:"Invalid User data!!"})
        }


        res.status(200).json({message:"User registered successfully."})
    
} catch (error) {
    console.log("Error in register",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
    
}
}

export const login =async(req,res)=>{
const {email,password} =req.body;

try {
    
    if(!password|| !email){
        return res.status(400).json({message:"Please enter all fields!!"})
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValidate= emailRegex.test(email);
    
    if(!emailValidate){
         return res.status(400).json({ message: 'Please enter a valid email address.'})
    }
    
    const user= await User.findOne({email});
    
    if(!user){
        return res.status(400).json({ message: 'User not found!!' });
    }
    
    const isPassword=await bcrypt.compare(password,user.password);
    if(!isPassword){
        return res.status(401).json({ message: "Invalid email or password." });
    }
    
    generateTokenAndSetCookie(user._id,res);
    
    res.status(200).json({
        message: "User login successfully.",
        user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        plants: user.plants, 
        }
    });

  

} catch (error) {
    console.log("Error in login",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
}

}

export const getUserProfile =async(req,res)=>{
const {id}=req.params;
try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    if (req.user._id.toString() !== id) {
        return res.status(403).json({ message: "You are not authorized to view this profile." });
    }
    
    const user=await User.findById(id).select("-password");
    
    if(!user){
        return res.status(400).json({ message: 'User not found!!' });
    }
    
    res.status(200).json(user);
} catch (error) {
    console.log("Error in getUserProfile",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
}

}

export const updateUserProfile =async(req,res)=>{

const {name,email,currentpassword,newpassword} = req.body;

try {
    const user=await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({ message: "User not found!!" });
    }
    
    if(email && email!==user.email){
        const emailExist=await User.findOne({email});
        if(emailExist){
            return res.status(404).json({ message: "Email already in use!!" });
        } 

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

    }

    if(currentpassword && newpassword){
        const isPassword=await bcrypt.compare(currentpassword,user.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);
    }
    else if (currentpassword || newpassword) {
        return res.status(400).json({
            message: "Please provide both current password and new password to update.",
        });
    }
    
    user.name=name||user.name;
    user.email=email||user.email;
    
    const updatedUser = await user.save();
    
    res.status(200).json({
        message: "User details updated successfully.",
        user:{
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        plants: updatedUser.plants, 
        }
    });
} catch (error) {
    console.log("Error in update",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
}

}

export const deleteUserProfile =async(req,res)=>{
try {
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({ message: "User not found!!" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User account deleted successfully." });
} catch (error) {
    console.error("Error in deleteUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
}

}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure flag only in production
            sameSite: "strict", // CSRF protection
        });

        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({ error: "Internal Server Error!!" });
    }
};
