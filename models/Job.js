import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    company: {
        type: String, 
        required:[true, 'Company is required'],
        maxlength: 50,
    },
    position: {
        type: String, 
        required:[true, 'Position is required'],
        maxlength: 100,
            
    },
    status: {
        type: String, 
        enum:['interview', 'declined', 'pending'],
        default: 'pending', 
    },
    jobType: {
        type: String, 
        enum:['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time' ,
    },
    jobLocation: {
        type: String, 
        default: 'My city',
        required: true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required']
    },
},
    {timestamps:true}
)



export default mongoose.model('Job', JobSchema)