import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { deleteComment, editComment, getComments, newComment } from '../controllers/comment.controller.js'

export const commentRoutes=express.Router()

commentRoutes.post('/new-comment/:videoId',verifyToken,newComment)
commentRoutes.get('/:videoId',getComments)
commentRoutes.put('/:commentId',verifyToken,editComment)
commentRoutes.delete('/:commentId',verifyToken,deleteComment)