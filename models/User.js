import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:[true, 'Name is required'],
        minlength: 3,
        maxlength: 20,
        trim: true,    
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
    email: {
        type: String, 
        required:[true, 'Email is required'],
        unique: true,    
    },
    password: {
        type: String, 
        required:[true, 'Password is required'],
        minlength: 8,   
    },
})

export default mongoose.model('User', UserSchema)