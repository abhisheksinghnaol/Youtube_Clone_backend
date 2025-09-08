import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cloudinary from "../config/cloudinary.js";


export async function signup(req,res){
    try{
        const {userName,email,password}=req.body;
        
        const existinguser=await UserModel.findOne({email})
        if(existinguser) return res.status(404).json({message:"email already exist"})

              // Upload logo if provided
        // let logoUrl = '';
        

       const logo=await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath)

            const newUser=new UserModel({
        userName,
    email,
    password:bcrypt.hashSync(password, 10),
    logoUrl:logo.secure_url})
    const savedUser=await newUser.save()       //save to mongodb
    return res.status(200).json({message:savedUser})
    }
    catch(err){
        console.log("error:",err)
        return res.status(500).json({ error: err.message });
     }
}

export async function login(req,res){
    try{
        const {email,password}=req.body;
        const existingUser=await UserModel.findOne({email})
        console.log(existingUser)
        if(!existingUser) return res.status(404).json({message:"email does not exist"})
            const validPassword=bcrypt.compareSync(password, existingUser.password)
        if(!validPassword) return res.status(403).json({message:"Invalid Credentials"})
            var token = jwt.sign({ id: existingUser._id }, "secretKey", { expiresIn:'60m' });
        console.log(token);
        res.status(200).send({
            user:{
                userName:existingUser.userName,
                email:existingUser.email,
                accessToken:token
            }
        })
        
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
}



