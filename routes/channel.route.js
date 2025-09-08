import {createChannel, getChannel, subscribe, unsubscribe } from "../controllers/channel.controller.js"
import {verifyToken} from "../middleware/verifyToken.js"
import express from "express"



export const channelRoutes=express.Router()
    channelRoutes.post('/create',verifyToken,createChannel)
    channelRoutes.get('/get/:id',getChannel)
    channelRoutes.put('/subscribe/:channelId',verifyToken,subscribe)
    channelRoutes.put('/unsubscribe/:channelId',verifyToken,unsubscribe)
    