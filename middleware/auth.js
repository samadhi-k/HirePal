import { UnauthenticatedError } from "../errors/index.js"
import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {

    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('1Authentication Invalid')
    }
    console.log(authHeader)
    const token = authHeader.split(' ')[1]
    console.log(token);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId : payload.userId}
        next()
    } catch (error) {
        throw new UnauthenticatedError('2Authentication Invalid') 
    }
    
}

export default auth