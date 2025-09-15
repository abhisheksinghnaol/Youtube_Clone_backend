import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cloudinary from "../config/cloudinary.js";


export async function signup(req, res) {
  try {
    const { userName, channelName, email, password } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let logoUrl = "";

    // If logo is uploaded, upload to Cloudinary
    if (req.files?.logoUrl) {
      const logo = await cloudinary.uploader.upload(
        req.files.logoUrl.tempFilePath
      );
      logoUrl = logo.secure_url;
    }

    // Create new user
    const newUser = new UserModel({
      userName,
      channelName,
      email,
      password: bcrypt.hashSync(password, 10),
      logoUrl,
    });

    const savedUser = await newUser.save(); // Save to MongoDB

    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (err) {
    console.log("error:", err);
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



