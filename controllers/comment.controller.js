import CommentModel from "../model/Comment.model.js";
import mongoose from "mongoose";
import VideoModel from "../model/Video.model.js";

//add comment to video
export async function newComment(req,res){
    try{
        const videoId=req.params.videoId;
        const userId=req.user._id;
        const newComment=new CommentModel({
            _id:new mongoose.Types.ObjectId , 
            userId:userId,
            videoId:videoId,
            commentText:req.body.commentText,
        })
        await newComment.save()
        return res.status(200).json({
            comment:newComment
        })
    }
    catch(err){
        console.log("error:",err)
        return res.status(500).json({ error: err.message });
     }
}

//get all comments of video

export async function getComments(req,res){
    try{
       
        const comments=await CommentModel.find({videoId:req.params.videoId}).populate('userId','userName logoUrl')
        return res.status(200).json({
            commentList:comments
        })
    }
     catch(err){
        console.log("error:",err)
        return res.status(500).json({ error: err.message });
     }
}


//edit comment

export async function editComment(req,res){
    try{
        const commentId=req.params.commentId
        const comment=await CommentModel.findById(commentId)
        if(comment.userId.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"you cannot edit this comment"})
        }
        comment.commentText=req.body.commentText
        const updatedComment=await comment.save()
        return res.status(200).json({updatedComment:updatedComment})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:err.message})

    }
}


//delete comment

export async function deleteComment(req,res){
    try{
        const commentId=req.params.commentId
        const comment=await CommentModel.findById(commentId)
        if(comment.userId.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"you cannot delete this comment"})
        }
        const deletedComment=await CommentModel.findByIdAndDelete(commentId)
       
         return res.status(200).json({deletedComment:deletedComment})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:err.message})

    }
}