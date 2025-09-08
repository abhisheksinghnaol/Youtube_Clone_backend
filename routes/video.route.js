import { dislikedVideo, likedVideo, remove, update, upload, views } from "../controllers/video.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
import express from 'express'


export const videoRoutes=express.Router()

    // videoRoutes.get('/get')
    videoRoutes.post('/upload',verifyToken,upload)
    videoRoutes.put('/:videoId',verifyToken,update)
    videoRoutes.delete('/:videoId',verifyToken,remove)
    videoRoutes.put('/like/:videoId',verifyToken,likedVideo)
    videoRoutes.put('/dislike/:videoId',verifyToken,dislikedVideo)
    videoRoutes.put('/views/:videoId',views)
    
    