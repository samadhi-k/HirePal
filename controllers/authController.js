import User from "../models/User.js"
import {BadRequestError, UnauthenticatedError} from '../errors/index.js'

const register = async (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    const userAlreadyExists = await User.findOne({email})
    if(userAlreadyExists){
        throw new BadRequestError('Email already in use')
    }
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(201).json({
        user:{
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
        }
        , token,
        location: user.location,
    })  
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new UnauthenticatedError('Invalid inputs')
    }
    console.log(user);
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Password Incorrect')
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(201).json({
        user:{
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
        }
        , token, 
        location: user.location,
    })  
}

const updateUser = (req, res) => {
    
    res.send('update user')
}

export {register, login, updateUser}