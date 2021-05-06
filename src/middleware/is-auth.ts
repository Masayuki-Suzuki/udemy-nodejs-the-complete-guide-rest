import jwt from 'jsonwebtoken'
import { CustomError, JWTParams } from '../types/utils'

export default (req, res, next) => {
    if (!req.get('Authorization')) {
        const error: CustomError = new Error('Not Authenticated.')
        error.statusCode = 401
        throw error
    }
    const token = req.get('Authorization').split(' ')[1]
    let decodedToken: JWTParams

    try {
        decodedToken = jwt.verify(
            token,
            String(process.env.JWT_SECRET)
        ) as JWTParams
    } catch (err) {
        console.error(err)
        throw err
    }

    if (!decodedToken) {
        const error: CustomError = new Error('Not Authenticated.')
        error.statusCode = 401
        throw error
    }

    req.userId = decodedToken.userId
    next()
}
