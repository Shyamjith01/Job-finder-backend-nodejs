import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber:{
        type:Number,
    },
    password: {
        type: String,
        unique: true,
        min: 6,
        required: true,
    }
}, {
    timestamps: true
});

// module.exports = mongoose.model("User",userSchema);
export default mongoose.model("User",userSchema);
