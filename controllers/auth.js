import bcrypt from "bcrypt";
import  Jwt from "jsonwebtoken";
import User from "../model/User.js";



// REGISTER A USER 

export const register = async(req,res)=>{ 
    try {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            password
        } = req.body;

        const salt = await bcrypt.genSalt();
        const saltPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            mobileNumber,
            password:saltPassword
        });


        const savedUser = await newUser.save();
        res.status(201).json(savedUser);  
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const login = async (req,res)=>{ 
    try {
        const { email , password } = req.body;
        const user = await User.findOne({email:email}); 
        if(!user) return res.status(200).json({message:"User does not exist.",success:false});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(200).json({message:"Invalid credential.",success:false});

        const token = Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        delete user.password;

        res.status(200).json({token,user,success:true}); 
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};