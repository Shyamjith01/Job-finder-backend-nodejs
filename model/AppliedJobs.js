import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const appliedJObs = new mongoose.Schema({
    jobId:{
        type:ObjectId,
        required:true
    },
    userId:{
        type:ObjectId,
        required:true
    },
    appliedDate:{
        type:Date,
        required:true,
    },
    prevCompany:{
        type:String,
        required:true
    },
    prevExperience:{
        type:Number,
        required:true
    },
    resume:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    }
},
{
    timestamps:true
});

export default mongoose.model("AppliedJobs",appliedJObs);