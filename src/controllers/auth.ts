import bcrypt from 'bcryptjs'
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

// export const login = (req, res, next) => {}
