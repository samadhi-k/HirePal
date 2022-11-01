import mongoose from "mongoose";
import validator from 'validator';

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

export default mongoose.model('User', UserSchema)