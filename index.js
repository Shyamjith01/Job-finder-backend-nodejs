import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.js";
import JobRoute from "./routes/job.js";
import cors from 'cors'; 
const app = express();  

const corsOption = {
    origin:"*",
    Credential:true,
    optionSuccessStatus:200
}
app.use(cors(corsOption));  
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},).then((res)=>{
    console.log("mongo DB connected");
}).catch((err)=>{
    console.log("Connection err =>" , err);
})

app.use(express.json());

app.use("/api/auth",AuthRoute);
app.use("/api/jobs",JobRoute)

app.listen(8800,()=>{
    console.log("Backend is running started");
})

export default app;