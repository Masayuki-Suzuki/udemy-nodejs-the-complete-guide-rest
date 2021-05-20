import jwt from 'jsonwebtoken'
import { JWTParams } from '../types/utils'

export default (req, res, next) => {
    if (!req.get('Authorization')) {
        req.isAuth = false
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next()
    }
    const token = req.get('Authorization').split(' ')[1]
    let decodedToken: JWTParams

    try {
        decodedToken = jwt.verify(
            token,
            String(process.env.JWT_SECRET)
        ) as JWTParams
    } catch (err) {
        req.isAuth = false
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next()
    }

    req.userId = decodedToken.userId
    req.isAuth = true
    next()
}
