import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const SavedJObs = new mongoose.Schema({
    jobId:ObjectId,
    userId:ObjectId,
    savedDate:{
        type:Date,
        required:true
    }
},
{
    timestamps:true
});

export default mongoose.model("SavedJobs",SavedJObs);