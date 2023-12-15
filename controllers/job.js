import Jwt from "jsonwebtoken";
import Job from "../model/Job.js";
import verifyToken from "../Middleware/middleware.js";
import Savedjobs from "../model/Savedjobs.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import AppliedJobs from "../model/AppliedJobs.js";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//GET JOBS 
export const getJobs = async (req, res) => {
    try {  
        let jobs; 
        const exp = Number(req.query.experience); 
        let queries = {
            jobTitle: { $regex: `${req.query.search}` },
            maxExperience: { $gte: exp ? exp : 0 },
            minExperience: { $lte: exp ? exp : 20 }
        }

        if (req.query.jobtype != '') {
            queries = {
                jobTitle: { $regex: `${req.query.search}` },
                jobType: { $in: req.query.jobtype },
                maxExperience: { $gte: exp ? exp : 0 },
                minExperience: { $lte: exp ? exp : 20 }
            }
        }

        if (req.query.employer) {
            jobs = await Job.aggregate([
                {
                    $match: { createdBy: new ObjectId(req.user._id) }
                }
            ]);
            res.status(200).json({ message: "jobs fetched...", jobs });
        } else {
            jobs = await Job.find(queries);
            res.status(200).json({ message: "jobs fetched...", jobs });
        }
    } catch (error) {
        console.log(error, "Error");
    }
}


export const createJob = async (req, res) => {
    try {  
        if (req.body) {
            const jobDetails = {
                ...req.body,
                minExperience: Number(req.body.minExperience),
                maxExperience: Number(req.body.maxExperience),
                createdBy: new ObjectId(req.user._id)
            }
            const job = new Job(jobDetails);

            const savedJobs = await job.save();
            res.status(201).json(savedJobs);
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const handleSaveJobs = async (req, res) => { 
    try {  
        if (req.body) {

            const jobDetails = {
                ...req.body
            };

            const job = new Savedjobs(jobDetails);


            const savedJObs = await job.save();

            const updatedJob = await Job.updateOne({ _id: jobDetails.jobId }, { $push: { isSaved: req.user._id } });

            res.status(201).json(updatedJob);
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getSavedJobs = async (req, res) => { 
    const jobs = await Savedjobs.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'job'
            }
        },
        {
            $unwind: '$job'
        },
    ]);
    res.status(201).json(jobs);

}

export const removeItemFromSaved = async (req, res) => {
    try {
        const id = req.params.id; 
        const removedJobs = await Savedjobs.deleteOne({ jobId: id });

        const updatedJob = await Job.updateOne({ _id: id }, { $pullAll: { isSaved: [req.user._id] } });
 
        res.status(201).json(updatedJob);
    } catch (error) {
        return res.status(401).json({ error: error })
    }
}

export const handleJobApply = async (req, res) => { 
    try {
        const apply = {
            jobId: new ObjectId(req.body.jobId),
            userId: new ObjectId(req.body.userId),
            appliedDate: req.body.appliedDate,
            prevcompany: req.body.prevCompany,
            prevExperience: req.body.prevExperience,
            resume: req.file
        };
 
        const appliedJob = new AppliedJobs({
            jobId: apply.jobId,
            userId: apply.userId,
            appliedDate: apply.appliedDate,
            prevCompany: apply.prevcompany,
            prevExperience: apply.prevExperience,
            resume: apply.resume
        });

        const appliedJobs = await appliedJob.save();  
        const updated = await Job.updateOne({ _id: apply.jobId }, { $inc: { appliedCount: 1 } });


        res.status(201).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const job = await AppliedJobs.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'job'
                },
            },
            {
                $unwind: '$job'
            }
        ]);

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAppliedUsers = async (req, res) => {
    try {
        const { id } = req.params; 
        const users = await AppliedJobs.aggregate([
            {
                $match: { jobId: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);

        const job = await Job.findById({ _id: id });
        res.status(200).json({ users: users, job: job });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};


export const downloadResume = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await AppliedJobs.findById(id);
        if (!item) {
            return next(new Error("No item found"))
        } 
        const file = item.resume.filename;
        const destination = item.resume.destination;

        const url = `../../../../../../../Users/SHYAMJITH/Desktop/Projects/jobfinder/Server/public/images/${file}`;

        const filee = fs.createReadStream(url);
        const fileNamee = (new Date()).toISOString();
        res.setHeader('Content-Disposition', 'attachment: filename="' + fileNamee + '"');
        filee.pipe(res);

    } catch (error) { 
        res.status(500).json({ error: error.message })
    }
}

export const updateJobAppliedStatus = async (req, res) => {
    try { 
        const result = await AppliedJobs.updateOne({_id:req.body._id},{$set:{status :req.body.status}});
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

