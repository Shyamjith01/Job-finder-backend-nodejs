// const router = require('express').Router;
import express from "express";
const router = express.Router()
// // const user = require('../model/User');
// import router from "express"

import user from "../model/User.js"
import {  login, register } from "../controllers/auth.js";
import { setDriver } from "mongoose";
import verifyToken from "../Middleware/middleware.js";

router.post("/login",login);
router.post("/register",register);

  
export default router; 