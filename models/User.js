import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:[true, 'Name is required'],
        minlength: 3,
        maxlength: 20,
        trim: true,    
    },
    email: {
        type: String, 
        required:[true, 'Email is required'],
        validate:{
            validator:validator.isEmail,
            message:'Please provide a valid email'
        },
        unique: true,    
    },
    password: {
        type: String, 
        required:[true, 'Password is required'],
        minlength: 8, 
        select: false,  
    },
    lastName: {
        type: String, 
        trim: true,
        maxlength: 20,
        default: 'Last name' ,
    },
    location: {
        type: String, 
        trim: true,
        maxlength: 20,
        default: 'My city' ,
    },
})

UserSchema.pre('save', async function(){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    }
    return
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model('User', UserSchema)