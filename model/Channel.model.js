
// import mongoose from "mongoose";

// const channelSchema=new mongoose.Schema({
//     channelName:{type:String,required:true},
//     owner:{type:String},
//     description:{type:String},
//     channelBanner:{type:String},
//     subscribers:{type:Number,default:0},
//     subscribedBy:[{type:mongoose.Schema.ObjectId,ref:'User'}]
// },{timestamps:true})


// const ChannelModel=new mongoose.model('Channel',channelSchema)
// export default ChannelModel;


const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ proper reference
  description: { type: String },
  channelBanner: { type: String },
  subscribers: { type: Number, default: 0 },
  subscribedBy: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
}, { timestamps: true });
