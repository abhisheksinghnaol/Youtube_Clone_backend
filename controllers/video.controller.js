import VideoModel from '../model/Video.model.js'
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'


export async function own_videos(req, res) {
    try {
        

        const videos = await VideoModel.find({userId:req.user._id}).populate('userId','channelName logoUrl subscribers')
        .populate("channelId", "channelName channelBanner subscribers");
 

        return res.status(200).json({
            videos:videos
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}



// Get all videos (for suggested sidebar)
export async function getAllVideos(req, res) {
  try {
    const videos = await VideoModel.find().populate('userId', 'channelName logoUrl subscribers').lean();
    return res.status(200).json({ videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


//Upload Video

export async function upload(req, res) {
try {
//Upload thumbnail and video to cloudinary
const uploadedThumbnail=await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
const uploadedVideo=await cloudinary.uploader.upload(req.files.video.tempFilePath,{
    resource_type:'video'
})


const newVideo=new VideoModel({
    _id:new mongoose.Types.ObjectId,
    title: req.body.title,
    description:req.body.description,
    userId:req.user._id,
    channelId: userChannel._id,
    thumbnailUrl: uploadedThumbnail.secure_url,
    thumbnailId:uploadedThumbnail.public_id,
    videoUrl: uploadedVideo.secure_url,
    videoId: uploadedVideo.public_id,
    category: req.body.category,
})
await newVideo.save()
// console.log(newVideo)
return res.status(201).json({message:'Video created',newVideo})
}
 catch (e) {
return res.status(500).json({ message: e.message });
}
}


//Update Video


export async function update(req,res){
    try{
        const videoId=req.params.videoId;
         //  Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }
        
        const video=await VideoModel.findById(videoId)
        if(!video) return res.status(400).json({message:"Video not found"})
            //check if the user updating the video is the owner
        if(video.userId.toString()===req.user._id.toString()){
            await cloudinary.uploader.destroy(video.thumbnailId)
            const updatedThumbnail=await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
            const updatedData={
                title: req.body.title,
                description:req.body.description,
                category: req.body.category,
                thumbnailUrl: updatedThumbnail.secure_url,
                thumbnailId:updatedThumbnail.public_id,
            }
           const updatedVideoDetail= await VideoModel.findByIdAndUpdate(req.params.videoId,updatedData,{new:true})
           return res.status(200).json({
            updatedVideo:updatedVideoDetail
           })
           
        }
        console.log(verifiedUser);
        
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:err.message})
        
    }
}

//Delete Video


export async function remove(req,res){
    try{
        const videoId=req.params.videoId
        const video=await VideoModel.findById(videoId)
        if(video.userId.toString()===req.user._id.toString())
            {
                await cloudinary.uploader.destroy(video.videoId,{resource_type:'video'})
                await cloudinary.uploader.destroy(video.thumbnailId)
               const deletedResponse= await VideoModel.findByIdAndDelete(videoId)
               return res.status(200).json({deletedResponse:deletedResponse})
             }
             else{
                return res.status(400).json({message:"You are not authorized to make changes in this video"})
             }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:err.message})
        
    }
}

//Like video

// export async function likedVideo(req,res){
//     try{
//         const videoId=req.params.videoId;
//         const video=await VideoModel.findById(videoId)
//         if(video.likedBy.includes(req.user._id)){
//             return res.status(400).json({message:"already liked"})
//         }
//         if(video.dislikedBy.includes(req.user._id)){
//             video.dislikes-=1;
//             video.dislikedBy=video.dislikedBy.filter(userId=>userId.toString()!==req.user._id.toString())
//         }
//         video.likes+=1
//         video.likedBy.push(req.user._id)
//         await video.save()
//         return res.status(200).json({message:"liked"})
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({error:err.message})
//     }
// }

// //Dislike

// export async function dislikedVideo(req,res){
//     try{
//         const videoId=req.params.videoId;
//         const video=await VideoModel.findById(videoId)
//         if(video.dislikedBy.includes(req.user._id)){
//             return res.status(400).json({message:"already disliked"})
//         }
//         if(video.likedBy.includes(req.user._id)){
//             video.likes-=1
//             video.likedBy=video.likedBy.filter(userId=>userId.toString()!==req.user._id.toString())
//         }
//         video.dislikes+=1
//         video.dislikedBy.push(req.user._id)
//         await video.save()
//         return res.status(200).json({message:"disliked"})
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({error:err.message})
//     }
// }

// likedVideo 
export async function likedVideo(req, res) {
  try {
    const videoId = req.params.videoId;
    const video = await VideoModel.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // if already liked, toggle off
    if (video.likedBy.some(id => id.toString() === req.user._id.toString())) {
      video.likes = Math.max(0, (video.likes || 0) - 1);
      video.likedBy = video.likedBy.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // remove dislike if present
      if (video.dislikedBy.some(id => id.toString() === req.user._id.toString())) {
        video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
        video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== req.user._id.toString());
      }
      video.likes = (video.likes || 0) + 1;
      video.likedBy.push(req.user._id);
    }

    await video.save();
    // return the updated video
    return res.status(200).json({ video });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}

// dislikedVideo 
export async function dislikedVideo(req, res) {
  try {
    const videoId = req.params.videoId;
    const video = await VideoModel.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // if already disliked, toggle off
    if (video.dislikedBy.some(id => id.toString() === req.user._id.toString())) {
      video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
      video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // remove like if present
      if (video.likedBy.some(id => id.toString() === req.user._id.toString())) {
        video.likes = Math.max(0, (video.likes || 0) - 1);
        video.likedBy = video.likedBy.filter(id => id.toString() !== req.user._id.toString());
      }
      video.dislikes = (video.dislikes || 0) + 1;
      video.dislikedBy.push(req.user._id);
    }

    await video.save();
    // return the updated video
    return res.status(200).json({ video });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}


//Views API

export async function views(req,res){
    try{
        const video=await VideoModel.findById(req.params.videoId)
        video.views+=1;
        await video.save()
        return res.status(200).json({message:"Ok"})
    }
    catch(err){
         console.log(err);
        return res.status(500).json({error:err.message})
    }
}