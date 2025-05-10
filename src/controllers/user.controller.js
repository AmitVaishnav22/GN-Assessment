import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import {loadData,saveData} from "../temp_db/temp_db.js"


const registerUser=async (req,res)=>{
    try {
        const {name,email,password,role} = req.body
        if(!name || !email || !password || !role){
            return res.status(400).json({message:"Please provide all fields"})
        }
        const users=loadData("user.model.json")||[]
        const userExists=users.find(user=>user.email===email)
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser={
            id:Date.now(),
            name,
            email,
            password:hashedPassword,
            role
        }
        users.push(newUser)
        saveData("user.model.json",users)
        res.status(201).json({user:newUser,message:"User registered successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const loginUser=async (req,res)=>{
    try {
       
        const {email,password} = req.body
        const users=loadData("user.model.json")
        const user=users.find(user=>user.email===email)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"})
        }
        const payload = {
            id: user.id,
            role: user.role
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        saveData("user.model.json", users);
        const options={
            httpOnly:true,
            secure:true
        }
        res
        .cookie("accessToken", accessToken, options) 
        .cookie("refreshToken", refreshToken,options) 
        .status(200)
        .json({ message: "Login successful", user: user });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getUser=async (req,res)=>{
    try {
        const {id} = req.params
        const users=loadData("user.model.json")
        const user=users.find(user=>user.id===parseInt(id))
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const logoutUser = async (req, res) => {
    try {
      const users = loadData("user.model.json");
      const user = users.find((u) => u.id === req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.refreshToken = null;
      saveData("user.model.json", users);
  
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      };
  
      res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(200)
        .json({ message: "User logged out successfully" });
  
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

export {registerUser,loginUser,getUser,logoutUser}