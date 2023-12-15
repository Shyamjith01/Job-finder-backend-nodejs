import express from "express";
const router = express.Router();
import multer from "multer";
 

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./public/images")
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}_${file.originalname}`)
    }
});

const upload = multer({storage});
 
import { createJob, downloadResume, getAppliedJobs, getAppliedUsers, getJobs, getSavedJobs, handleJobApply, handleSaveJobs, removeItemFromSaved, updateJobAppliedStatus } from "../controllers/job.js";
import verifyToken from "../Middleware/middleware.js";

router.get('/',verifyToken,getJobs);
router.post('/create',verifyToken,createJob);
router.post('/save',verifyToken,handleSaveJobs);
router.get('/save',verifyToken,getSavedJobs);
router.delete('/save/:id',verifyToken,removeItemFromSaved);
router.post('/apply',upload.single('resume'),handleJobApply); 
router.get("/apply",verifyToken,getAppliedJobs);
router.get('/applied-users/:id',verifyToken,getAppliedUsers);
router.get('/download-resume/:id',verifyToken,downloadResume);
router.put('/applied-job/status',verifyToken,updateJobAppliedStatus);
router.get('/:query',verifyToken,getJobs);

export default router;
