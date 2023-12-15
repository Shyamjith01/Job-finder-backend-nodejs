import  Jwt from "jsonwebtoken";

const config = process.env;

const verifyToken = (req,res,next)=>{ 
    try {
        if(!req.headers.authorization){
            return res.status(401).json({error:"Not authorization"});
        }
    
        const authHeaders = req.headers.authorization;
    
        const token = authHeaders.split(" ")[1];
        const decoded = Jwt.verify(token,process.env.JWT_SECRET);
    
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid token")
    }
    return next();
}

export default verifyToken;