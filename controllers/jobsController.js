import Job from "../models/Job.js"
import {BadRequestError, NotFoundError} from "../errors/index.js"

const createJob = async (req, res) => {
    const {position, company} = req.body

    if(!position || !company){
        throw new BadRequestError('Please provide all values')
    }

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(201).json({job})

}
const getAllJobs = async (req, res) => {

    const {search, status, jobType, sort} = req.query
    const queryObject = {
        createdBy: req.user.userId,
    }

    if(status && status !== 'all'){
        queryObject.status = status
    }
    if(jobType && jobType !== 'all'){
        queryObject.jobType = jobType
    }
    if(search && search){
        queryObject.position = {$regex: search, $options:'i'}
    }

    let result = Job.find(queryObject)

    if(sort === 'latest'){
        result = result.sort('-createdAt')
    }
    if(sort === 'oldest'){
        result = result.sort('createdAt')
    }
    if(sort === 'a-z'){
        result = result.sort('position')
    }
    if(sort === 'z-a'){
        result = result.sort('-position')
    }

    const jobs = await result
    res.status(200).json({jobs, totalJobs:jobs.length, numOfPages:1})
}
const updateJob = async (req, res) => {
    res.send('update job')
}
const deleteJob = async (req, res) => {
    res.send('delete job')
}
const showStats = async (req, res) => {
    res.send('show stats')
}


export { createJob, getAllJobs, updateJob, deleteJob, showStats }