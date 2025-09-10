import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
{
_id:mongoose.Schema.Types.ObjectId   , 
title: { type: String, required: true},
description: String,
userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
thumbnailUrl: String,
thumbnailId:{ type: String },
videoUrl: { type: String},
videoId: { type: String},
views: { type: Number, default: 0 },
likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },
category: { type: String, default: 'General' },
likedBy:[{type:mongoose.Schema.ObjectId,ref:'User'}],
dislikedBy:[{type:mongoose.Schema.ObjectId,ref:'User'}],
uploadDate: { type: Date, default: Date.now },
},
{ timestamps: true }
);

const VideoModel=new mongoose.model('videos',videoSchema)
export default VideoModel;