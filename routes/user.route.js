import { login, signup } from "../controllers/user.controller.js";
import express from 'express'


export const userRoutes=express.Router()

    userRoutes.post('/signup',signup)
    userRoutes.post('/login',login)
