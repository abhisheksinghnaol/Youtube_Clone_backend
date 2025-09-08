import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
{
_id:mongoose.Schema.Types.ObjectId   , 
userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
videoId: { type: String,required:true},
commentText:{type:String,required:true},
},
{ timestamps: true }
);

const CommentModel=new mongoose.model('comments',commentSchema)
export default CommentModel;