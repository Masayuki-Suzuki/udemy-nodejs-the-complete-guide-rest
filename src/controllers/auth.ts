import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/user'
import { CustomError } from '../types/utils'

export const signUp = async (req, res, next): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error: CustomError = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        next(error)
    }

    const { email, name } = req.body
    const password = await bcrypt.hash(req.body.password, 12).catch(err => {
        console.error(err)
        next(err)
    })

    if (password) {
        const user = new User({
            email,
            name,
            password
        })

        const result = user.save().catch(err => {
            console.error(err)
            next(err)
        })

        if (result) {
            res.status(201).json({
                message: 'User Created.',
                userId: user._id
            })
        } else {
            const err: CustomError = new Error(
                'Unable to get result of save user data.'
            )
            next(err)
        }
    } else {
        const err: CustomError = new Error('Unable to hash your password')
        next(err)
    }
}

export const login = async (req, res, next): Promise<void> => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).catch(err => {
        console.error(err)
        const error: CustomError = new Error(
            'A user with this email could not be found.'
        )
        error.statusCode = 401
        next(error)
    })

    if (user) {
        const result = await bcrypt.compare(password, user.password)
        if (result) {
            const params = {
                email: user.email,
                userId: user._id.toString()
            }
            const token = jwt.sign(params, String(process.env.JWT_SECRET), {
                expiresIn: '1h'
            })
            res.status(200).json({ token, userId: user._id.toString() })
        } else {
            const error: CustomError = new Error('Wrong password.')
            error.statusCode = 401
            next(error)
        }
    } else {
        const err: CustomError = new Error('No user exists.')
        err.statusCode = 404
        next(err)
    }
}
