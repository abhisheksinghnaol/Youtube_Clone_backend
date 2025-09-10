import mongoose from "mongoose"



const userSchema=new mongoose.Schema({
    user_id:mongoose.Schema.Types.ObjectId,
    userName:{type:String,required:true},
    channelName:{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    email:{type:String,required:true},
    password:{type:String,required:true},
    logoUrl:{type:String},
    subscribedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],  //channels which user had subscribed
},{timestamps:true})

const UserModel=new mongoose.model('User',userSchema)
export default UserModel