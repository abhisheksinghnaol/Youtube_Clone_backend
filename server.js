import express from 'express'
import {userRoutes} from './routes/user.route.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import { channelRoutes } from './routes/channel.route.js';
import { videoRoutes } from './routes/video.route.js';
import { commentRoutes } from './routes/comment.route.js';
import cors from 'cors'

dotenv.config()
const app=express();

async function connectDb(){
try{
    const mongodbConnection=await mongoose.connect(process.env.MONGO_URI)
    if(mongodbConnection){
        console.log("DB connected successfully");
        
    }

}
catch(err){
    console.log("error in connecting DB:",err.message)
}
}
connectDb()


app.get('/',(req,res)=>{
    res.send("Welcome to root route")
})

app.use(cors())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(express.json())


app.use('/user',userRoutes);
app.use('/channel',channelRoutes)
app.use('/video',videoRoutes)
app.use('/comment',commentRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Connected to Port:${PORT}`);
    
})



//Abhishek
//pa6yIftWG2Ya7bF3