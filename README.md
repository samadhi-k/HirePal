

#### Change State Values With Handle Change

- [JS Nuggets Dynamic Object Keys](https://youtu.be/_qxCYtWm0tw)

```js
actions.js

export const HANDLE_CHANGE = 'HANDLE_CHANGE'
```

```js
appContext.js

const handleChange = ({ name, value }) => {
  dispatch({
    type: HANDLE_CHANGE,
    payload: { name, value },
  })
}

value={{handleChange}}
```

```js
reducer.js

if (action.type === HANDLE_CHANGE) {
  return { ...state, [action.payload.name]: action.payload.value }
}
```

```js
AddJob.js

const { handleChange } = useAppContext()

const handleJobInput = (e) => {
  handleChange({ name: e.target.name, value: e.target.value })
}
```

#### Clear Values

```js
actions.js

export const CLEAR_VALUES = 'CLEAR_VALUES'
```

```js
appContext.js

const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

value={{clearValues}}
```

```js
reducer.js

if (action.type === CLEAR_VALUES) {
  const initialState = {
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: state.userLocation,
    jobType: 'full-time',
    status: 'pending',
  }
  return { ...state, ...initialState }
}
```

```js
AddJob.js

const { clearValues } = useAppContext()

return (
  <div className='btn-container'>
    {/* submit button */}

    <button
      className='btn btn-block clear-btn'
      onClick={(e) => {
        e.preventDefault()
        clearValues()
      }}
    >
      clear
    </button>
  </div>
)
```

#### Create Job

```js
actions.js

export const CREATE_JOB_BEGIN = 'CREATE_JOB_BEGIN'
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS'
export const CREATE_JOB_ERROR = 'CREATE_JOB_ERROR'
```

```js
appContext.js

const createJob = async () => {
  dispatch({ type: CREATE_JOB_BEGIN })
  try {
    const { position, company, jobLocation, jobType, status } = state

    await authFetch.post('/jobs', {
      company,
      position,
      jobLocation,
      jobType,
      status,
    })
    dispatch({
      type: CREATE_JOB_SUCCESS,
    })
    // call function instead clearValues()
    dispatch({ type: CLEAR_VALUES })
  } catch (error) {
    if (error.response.status === 401) return
    dispatch({
      type: CREATE_JOB_ERROR,
      payload: { msg: error.response.data.msg },
    })
  }
  clearAlert()
}
```

```js
AddJob.js

const { createJob } = useAppContext()

const handleSubmit = (e) => {
  e.preventDefault()
  // while testing

  // if (!position || !company || !jobLocation) {
  //   displayAlert()
  //   return
  // }
  if (isEditing) {
    // eventually editJob()
    return
  }
  createJob()
}
```

```js
reducer.js

if (action.type === CREATE_JOB_BEGIN) {
  return { ...state, isLoading: true }
}
if (action.type === CREATE_JOB_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'success',
    alertText: 'New Job Created!',
  }
}
if (action.type === CREATE_JOB_ERROR) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'danger',
    alertText: action.payload.msg,
  }
}
```

#### Get All Jobs

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId })

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Jobs State Values

```js
appContext.js

const initialState = {
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
}
```

#### Get All Jobs Request

```js
actions.js
export const GET_JOBS_BEGIN = 'GET_JOBS_BEGIN'
export const GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS'
```

```js
appContext.js

import React, { useReducer, useContext, useEffect } from 'react'

const getJobs = async () => {
  let url = `/jobs`

  dispatch({ type: GET_JOBS_BEGIN })
  try {
    const { data } = await authFetch(url)
    const { jobs, totalJobs, numOfPages } = data
    dispatch({
      type: GET_JOBS_SUCCESS,
      payload: {
        jobs,
        totalJobs,
        numOfPages,
      },
    })
  } catch (error) {
    console.log(error.response)
    logoutUser()
  }
  clearAlert()
}

useEffect(() => {
  getJobs()
}, [])

value={{getJobs}}

```

```js
reducer.js

if (action.type === GET_JOBS_BEGIN) {
  return { ...state, isLoading: true, showAlert: false }
}
if (action.type === GET_JOBS_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    jobs: action.payload.jobs,
    totalJobs: action.payload.totalJobs,
    numOfPages: action.payload.numOfPages,
  }
}
```

#### AllJobs Page Setup

- create
- SearchContainer export
- JobsContainer export
- Job
- JobInfo

```js
AllJobs.js

import { JobsContainer, SearchContainer } from '../../components'
const AllJobs = () => {
  return (
    <>
      <SearchContainer />
      <JobsContainer />
    </>
  )
}

export default AllJobs
```

```js
JobsContainer.js
import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Job from './Job'
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {
  const { getJobs, jobs, isLoading, page, totalJobs } = useAppContext()
  useEffect(() => {
    getJobs()
  }, [])

  if (isLoading) {
    return <Loading center />
  }
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className='jobs'>
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />
        })}
      </div>
    </Wrapper>
  )
}

export default JobsContainer
```

```js
Job.js

import moment from 'moment'

const Job = ({ company }) => {
  return <h5>{company}</h5>
}

export default Job
```

#### Moment.js

- Format Dates
- [moment.js](https://momentjs.com/)

- stop server
- cd client

```sh
npm install moment

```

```js
Job.js

import moment from 'moment'

const Job = ({ company, createdAt }) => {
  let date = moment(createdAt)
  date = date.format('MMM Do, YYYY')
  return (
    <div>
      <h5>{company}</h5>
      <h5>{date}</h5>
    </div>
  )
}

export default Job
```

#### Job Component - Setup

```js
appContext.js

const setEditJob = (id) => {
  console.log(`set edit job : ${id}`)
}
const deleteJob = (id) =>{
  console.log(`delete : ${id}`)
}
value={{setEditJob,deleteJob}}
```

```js
Job.js

import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
}) => {
  const { setEditJob, deleteJob } = useAppContext()

  let date = moment(createdAt)
  date = date.format('MMM Do, YYYY')

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        {/* content center later */}
        <footer>
          <div className='actions'>
            <Link
              to='/add-job'
              onClick={() => setEditJob(_id)}
              className='btn edit-btn'
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Job
```

#### JobInfo

```js
JobInfo.js

import Wrapper from '../assets/wrappers/JobInfo'

const JobInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className='icon'>{icon}</span>
      <span className='text'>{text}</span>
    </Wrapper>
  )
}

export default JobInfo
```

```js
Job.js
return (
  <div className='content'>
    <div className='content-center'>
      <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
      <JobInfo icon={<FaCalendarAlt />} text={date} />
      <JobInfo icon={<FaBriefcase />} text={jobType} />
      <div className={`status ${status}`}>{status}</div>
    </div>
    {/* footer content */}
  </div>
)
```

#### SetEditJob

```js
actions.js
export const SET_EDIT_JOB = 'SET_EDIT_JOB'
```

```js
appContext.js

const setEditJob = (id) => {
  dispatch({ type: SET_EDIT_JOB, payload: { id } })
}
const editJob = () => {
  console.log('edit job')
}
value={{editJob}}
```

```js
reducer.js

if (action.type === SET_EDIT_JOB) {
  const job = state.jobs.find((job) => job._id === action.payload.id)
  const { _id, position, company, jobLocation, jobType, status } = job
  return {
    ...state,
    isEditing: true,
    editJobId: _id,
    position,
    company,
    jobLocation,
    jobType,
    status,
  }
}
```

```js
AddJob.js
const { isEditing, editJob } = useAppContext()
const handleSubmit = (e) => {
  e.preventDefault()

  if (!position || !company || !jobLocation) {
    displayAlert()
    return
  }
  if (isEditing) {
    editJob()
    return
  }
  createJob()
}
```

#### Edit Job - Server

```js
jobsController.js

const updateJob = async (req, res) => {
  const { id: jobId } = req.params

  const { company, position } = req.body

  if (!company || !position) {
    throw new BadRequestError('Please Provide All Values')
  }

  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  // check permissions

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ updatedJob })
}
```

#### Alternative Approach

- optional
- multiple approaches
- different setups
- course Q&A

```js
jobsController.js
const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  const { company, position, jobLocation } = req.body

  if (!position || !company) {
    throw new BadRequestError('Please provide all values')
  }
  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`)
  }

  // check permissions

  // alternative approach

  job.position = position
  job.company = company
  job.jobLocation = jobLocation

  await job.save()
  res.status(StatusCodes.OK).json({ job })
}
```

#### Check Permissions

```js
jobsController.js

const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  const { company, position, status } = req.body

  if (!position || !company) {
    throw new BadRequestError('Please provide all values')
  }
  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`)
  }

  // check permissions
  // req.user.userId (string) === job.createdBy(object)
  // throw new UnAuthorizedError('Not authorized to access this route')

  // console.log(typeof req.user.userId)
  // console.log(typeof job.createdBy)

  checkPermissions(req.user, job.createdBy)

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ updatedJob })
}
```

- utils folder
- checkPermissions.js
- import in jobsController.js

```js
checkPermissions.js

import { UnAuthorizedError } from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId) => {
  // if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError.UnauthorizedError('Not authorized to access this route')
}

export default checkPermissions
```

#### Remove/Delete Job

```js
jobsController.js

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params

  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`)
  }

  checkPermissions(req.user, job.createdBy)

  await job.remove()
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
}
```

#### Delete Job - Front-End

```js
actions.js

export const DELETE_JOB_BEGIN = 'DELETE_JOB_BEGIN'
```

```js
appContext.js

const deleteJob = async (jobId) => {
  dispatch({ type: DELETE_JOB_BEGIN })
  try {
    await authFetch.delete(`/jobs/${jobId}`)
    getJobs()
  } catch (error) {
    logoutUser()
  }
}
```

```js
reducer.js

if (action.type === DELETE_JOB_BEGIN) {
  return { ...state, isLoading: true }
}
```

#### Edit Job - Front-End

```js
actions.js
export const EDIT_JOB_BEGIN = 'EDIT_JOB_BEGIN'
export const EDIT_JOB_SUCCESS = 'EDIT_JOB_SUCCESS'
export const EDIT_JOB_ERROR = 'EDIT_JOB_ERROR'
```

```js
appContext.js
const editJob = async () => {
  dispatch({ type: EDIT_JOB_BEGIN })
  try {
    const { position, company, jobLocation, jobType, status } = state

    await authFetch.patch(`/jobs/${state.editJobId}`, {
      company,
      position,
      jobLocation,
      jobType,
      status,
    })
    dispatch({
      type: EDIT_JOB_SUCCESS,
    })
    dispatch({ type: CLEAR_VALUES })
  } catch (error) {
    if (error.response.status === 401) return
    dispatch({
      type: EDIT_JOB_ERROR,
      payload: { msg: error.response.data.msg },
    })
  }
  clearAlert()
}
```

```js
reducer.js

if (action.type === EDIT_JOB_BEGIN) {
  return { ...state, isLoading: true }
}
if (action.type === EDIT_JOB_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'success',
    alertText: 'Job Updated!',
  }
}
if (action.type === EDIT_JOB_ERROR) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'danger',
    alertText: action.payload.msg,
  }
}
```

#### Create More Jobs

- [Mockaroo](https://www.mockaroo.com/)
- setup mock-data.json in the root

#### Populate Database

- create populate.js in the root

```js
populate.js

import { readFile } from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js'
import Job from './models/Job.js'

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Job.deleteMany()

    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    )
    await Job.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
```

#### Show Stats - Structure

- aggregation pipeline
- step by step
- [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

```js
jobsController.js

import mongoose from 'mongoose'

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  res.status(StatusCodes.OK).json({ stats })
}
```

#### Show Stats - Object Setup

- [Reduce Basics](https://youtu.be/3WkW9nrS2mw)
- [Reduce Object Example ](https://youtu.be/5BFkp8JjLEY)

```js
jobsController.js

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  res.status(StatusCodes.OK).json({ stats })
}
```

#### Show Stats - Default Stats

```js
jobsController.js

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }
  let monthlyApplications = []
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}
```

#### Show Stats - Function Setup

```js
actions.js

export const SHOW_STATS_BEGIN = 'SHOW_STATS_BEGIN'
export const SHOW_STATS_SUCCESS = 'SHOW_STATS_SUCCESS'
```

```js
appContext.js

const initialState = {
  stats: {},
  monthlyApplications: []

}

const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
console.log(error.response)
      // logoutUser()
    }

clearAlert()
  }
  value={{showStats}}
```

```js
reducers.js
if (action.type === SHOW_STATS_BEGIN) {
  return { ...state, isLoading: true, showAlert: false }
}
if (action.type === SHOW_STATS_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    stats: action.payload.stats,
    monthlyApplications: action.payload.monthlyApplications,
  }
}
```

#### Stats Page - Structure

- components
- StatsContainer.js
- ChartsContainer.js
- StatsItem.js
- simple return
- import/export index.js

```js
Stats.js

import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, Loading, ChartsContainer } from '../../components'

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext()
  useEffect(() => {
    showStats()
  }, [])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  )
}

export default Stats
```

#### StatsContainer

```js
StatsContainer.js

import { useAppContext } from '../context/appContext'
import StatItem from './StatItem'
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'
const StatsContainer = () => {
  const { stats } = useAppContext()
  const defaultStats = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'interviews scheduled',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: stats.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ]

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />
      })}
    </Wrapper>
  )
}

export default StatsContainer
```

#### StatItem

```js
StatItem.js

import Wrapper from '../assets/wrappers/StatItem'

function StatItem({ count, title, icon, color, bcg }) {
  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className='count'>{count}</span>
        <div className='icon'>{icon}</div>
      </header>
      <h5 className='title'>{title}</h5>
    </Wrapper>
  )
}

export default StatItem
```

#### Aggregate Jobs Based on Year and Month

```js
jobsController.js

let monthlyApplications = await Job.aggregate([
  { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
  {
    $group: {
      _id: {
        year: {
          $year: '$createdAt',
        },
        month: {
          $month: '$createdAt',
        },
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { '_id.year': -1, '_id.month': -1 } },
  { $limit: 6 },
])
```

#### Refactor Data

- install moment.js on the SERVER

```sh
npm install moment

```

```js
jobsController.js

import moment from 'moment'

monthlyApplications = monthlyApplications
  .map((item) => {
    const {
      _id: { year, month },
      count,
    } = item
    // accepts 0-11
    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM Y')
    return { date, count }
  })
  .reverse()
```

#### Charts Container

- BarChart.js
- AreaChart.js

```js
ChartsContainer.js
import React, { useState } from 'react'

import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ChartsContainer'

export default function ChartsContainer() {
  const [barChart, setBarChart] = useState(true)
  const { monthlyApplications: data } = useAppContext()

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>

      <button type='button' onClick={() => setBarChart(!barChart)}>
        {barChart ? 'AreaChart' : 'BarChart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  )
}
```

#### Recharts Library

- install in the Client!!!

[Recharts](https://recharts.org)

```sh
npm install recharts
```

#### Bar Chart

```js
BarChart.js

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={data}
        margin={{
          top: 50,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey='count' fill='#2cb1bc' barSize={75} />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

#### Area Chart

```js
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const AreaChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 50,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type='monotone' dataKey='count' stroke='#2cb1bc' fill='#bef8fd' />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

#### Filter

#### Get All Jobs - Initial Setup

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  // NO AWAIT
  let result = Job.find(queryObject)

  // chain sort conditions

  const jobs = await result

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Status

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (status !== 'all') {
    queryObject.status = status
  }

  // NO AWAIT
  let result = Job.find(queryObject)

  // chain sort conditions

  const jobs = await result

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### JobType

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (status !== 'all') {
    queryObject.status = status
  }
  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }
  // NO AWAIT
  let result = Job.find(queryObject)

  // chain sort conditions

  const jobs = await result

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Search

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (status !== 'all') {
    queryObject.status = status
  }
  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }
  // NO AWAIT
  let result = Job.find(queryObject)

  // chain sort conditions
  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }
  const jobs = await result

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Search Context Setup

```js
appContext.js

const initialState = {
  jobType: 'full-time',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  status: 'pending',
  statusOptions: ['pending', 'interview', 'declined']
  //
  //
  //
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const clearFilters = () =>{
console.log('clear filters')
}

value={{clearFilters}}

// remember this function :)
const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    })
  }

```

#### Search Container - Setup

```js
SearchContainer.js

import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'
const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext()

  const handleSearch = (e) => {
    if (isLoading) return
    handleChange({ name: e.target.name, value: e.target.value })
  }

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        {/* search position */}
        <div className='form-center'>
          <FormRow
            type='text'
            name='search'
            value={search}
            handleChange={handleSearch}
          ></FormRow>
          {/* rest of the inputs */}
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer
```

#### Search Container - Complete

```js
SearchContainer.js

import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'

const SearchContainer = () => {
  const {
    isLoading,
    search,
    handleChange,
    searchStatus,
    statusOptions,
    jobTypeOptions,
    searchType,
    clearFilters,
    sort,
    sortOptions,
  } = useAppContext()

  const handleSearch = (e) => {
    if (isLoading) return
    handleChange({ name: e.target.name, value: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    clearFilters()
  }
  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        {/* search position */}
        <div className='form-center'>
          <FormRow
            type='text'
            name='search'
            value={search}
            handleChange={handleSearch}
          ></FormRow>
          {/* search by status */}
          <FormRowSelect
            labelText='job status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          ></FormRowSelect>
          {/* search by type */}

          <FormRowSelect
            labelText='job type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          ></FormRowSelect>
          {/* sort */}

          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          ></FormRowSelect>
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer
```

#### Clear Filters

```js
actions.js

export const CLEAR_FILTERS = 'CLEAR_FILTERS'
```

```js
appContext.js

const clearFilters = () => {
  dispatch({ type: CLEAR_FILTERS })
}
```

```js
reducer.js

if (action.type === CLEAR_FILTERS) {
  return {
    ...state,
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
  }
}
```

#### Refactor Get All Jobs

```js
const getJobs = async () => {
  // will add page later
  const { search, searchStatus, searchType, sort } = state
  let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`
  if (search) {
    url = url + `&search=${search}`
  }
  dispatch({ type: GET_JOBS_BEGIN })
  try {
    const { data } = await authFetch(url)
    const { jobs, totalJobs, numOfPages } = data
    dispatch({
      type: GET_JOBS_SUCCESS,
      payload: {
        jobs,
        totalJobs,
        numOfPages,
      },
    })
  } catch (error) {
    // logoutUser()
  }
  clearAlert()
}
```

```js
JobsContainer.js

const JobsContainer = () => {
  const {
    getJobs,
    jobs,
    isLoading,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,

  } = useAppContext()
  useEffect(() => {
    getJobs()
  }, [ search, searchStatus, searchType, sort])

```

#### Limit and Skip

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query
  const queryObject = {
    createdBy: req.user.userId,
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }
  if (status !== 'all') {
    queryObject.status = status
  }
  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }
  let result = Job.find(queryObject)

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  const totalJobs = await result

  // setup pagination
  const limit = 10
  const skip = 1

  result = result.skip(skip).limit(limit)
  // 23
  // 4 7 7 7 2
  const jobs = await result
  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Page and Limit

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query
  const queryObject = {
    createdBy: req.user.userId,
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }
  if (status !== 'all') {
    queryObject.status = status
  }
  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }
  let result = Job.find(queryObject)

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit //10
  result = result.skip(skip).limit(limit)
  // 75
  // 10 10 10 10 10 10 10 5
  const jobs = await result
  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}
```

#### Total Jobs and Number Of Pages

```js
jobsController.js

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query
  const queryObject = {
    createdBy: req.user.userId,
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }
  if (status !== 'all') {
    queryObject.status = status
  }
  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }
  let result = Job.find(queryObject)

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}
```

#### PageBtnContainer Setup

- PageBtnContainer.js

```js
JobsContainer.js

import PageBtnContainer from './PageBtnContainer'

const { numOfPages } = useAppContext()

return (
  <Wrapper>
    <h5>
      {totalJobs} job{jobs.length > 1 && 's'} found
    </h5>
    <div className='jobs'>
      {jobs.map((job) => {
        return <Job key={job._id} {...job} />
      })}
    </div>
    {numOfPages > 1 && <PageBtnContainer />}
  </Wrapper>
)
```

#### PageBtnContainer - Structure

```js
PageBtnContainer.js

import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageButtonContainer = () => {
  const { numOfPages, page } = useAppContext()

  const prevPage = () => {
    console.log('prev page')
  }
  const nextPage = () => {
    console.log('next page')
  }

  return (
    <Wrapper>
      <button className='prev-btn' onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className='btn-container'>buttons</div>

      <button className='next-btn' onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageButtonContainer
```

#### Button Container

- [Array.from] (https://youtu.be/zg1Bv4xubwo)

```js
PageBtnContainer.js

const pages = Array.from({ length: numOfPages }, (_, index) => {
  return index + 1
})

return (
  <div className='btn-container'>
    {pages.map((pageNumber) => {
      return (
        <button
          type='button'
          className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
          key={pageNumber}
          onClick={() => console.log(page)}
        >
          {pageNumber}
        </button>
      )
    })}
  </div>
)
```

#### Change Page

```js
actions.js
export const CHANGE_PAGE = 'CHANGE_PAGE'
```

```js
appContext.js
const changePage = (page) => {
  dispatch({ type: CHANGE_PAGE, payload: { page } })
}
value={{changePage}}
```

```js
reducer.js

if (action.type === CHANGE_PAGE) {
  return { ...state, page: action.payload.page }
}
```

```js
PageBtnContainer.js

const { changePage } = useAppContext()
return (
  <button
    type='button'
    className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
    key={pageNumber}
    onClick={() => changePage(pageNumber)}
  >
    {pageNumber}
  </button>
)
```

#### Prev and Next Buttons

```js
PageBtnContainer.js
const prevPage = () => {
  let newPage = page - 1
  if (newPage < 1) {
    // newPage = 1
    // alternative
    newPage = numOfPages
  }
  changePage(newPage)
}
const nextPage = () => {
  let newPage = page + 1
  if (newPage > numOfPages) {
    // newPage = numOfPages
    // alternative
    newPage = 1
  }
  changePage(newPage)
}
```

#### Trigger New Page

```js
appContext.js

const getJobs = async () => {
  const { page, search, searchStatus, searchType, sort } = state

  let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
  // rest of the code
}
```

```js
JobsContainer.js

const { page } = useAppContext()
useEffect(() => {
  getJobs()
}, [page, search, searchStatus, searchType, sort])
```

```js
reducer.js

if (action.type === HANDLE_CHANGE) {
  // set back to first page

  return { ...state, page: 1, [action.payload.name]: action.payload.value }
}
```

#### Production Setup - Fix Warnings and logoutUser

- getJobs,deleteJob,showStats - invoke logoutUser()
- fix warnings

```sh
// eslint-disable-next-line
```

#### Production Setup - Build Front-End Application

- create front-end production application

```js
package.json
"scripts": {
    "build-client": "cd client && npm run build",
    "server": "nodemon server.js --ignore client",
    "client": "cd client && npm run start",
    "start": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\""

  },

```

```js
server.js

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// only when ready to deploy
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})
```

#### Security Packages

- remove log in the error-handler
- [helmet](https://www.npmjs.com/package/helmet)
  Helmet helps you secure your Express apps by setting various HTTP headers.
- [xss-clean](https://www.npmjs.com/package/xss-clean)
  Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
  Sanitizes user-supplied data to prevent MongoDB Operator Injection.
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
  Basic rate-limiting middleware for Express.

```sh
npm install helmet xss-clean express-mongo-sanitize express-rate-limit
```

```js
server.js

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
```

#### Limit Requests

```js
authRoutes.js

import rateLimiter from 'express-rate-limit'

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
```

#### Deploy To Heroku

- heroku login

```js
package.json

"engines": {
    "node": "16.x"
  }
"scripts":{
    "build-client": "cd client && npm run build",
    "install-client": "cd client && npm install",
    "heroku-postbuild": "npm run install-client && npm run build-client",
}
```

```js
Procfile

web: node server.js
```

- rm -rf .git
- git init
- git add .
- git commit -m "first commit"
- heroku create nameOfTheApp
- git remote -v
- add env variables
- git push heroku main/master
