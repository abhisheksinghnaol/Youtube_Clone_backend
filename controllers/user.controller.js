import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cloudinary from "../config/cloudinary.js";


export async function signup(req,res){
    try{
        const {userName,channelName,email,password}=req.body;
        
        const existinguser=await UserModel.findOne({email})
        if(existinguser) return res.status(409).json({message:"email already exist"})

           
       
        

       const logo=await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath)

            const newUser=new UserModel({
        userName:req.body.userName,
        channelName:req.body.channelName,
    email:req.body.email,
    password:bcrypt.hashSync(password, 10),
    logoUrl:logo.secure_url})
    const savedUser=await newUser.save()       //save to mongodb
    return res.status(201).json({message:savedUser})
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
                userId: existingUser._id,             
                userName: existingUser.userName,
                channelName:existingUser.channelName,
                email: existingUser.email,
                logoUrl: existingUser.logoUrl,        
                accessToken: token
            }
        })
        
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
}



