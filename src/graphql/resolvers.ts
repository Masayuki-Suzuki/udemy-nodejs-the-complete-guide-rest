import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { CustomError } from '../types/utils'

type ValidationError = {
    message: string
}

export type ExtendCustomError = Error & {
    data?: ValidationError[]
    code?: number
}

export default {
    async createUser({ userInput }, req) {
        const errors: ValidationError[] = []

        if (!validator.isEmail(userInput.email)) {
            errors.push({
                message: 'Email is invalid.'
            })
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 6 })
        ) {
            errors.push({ message: 'password is invalid' })
        }
        if (errors.length) {
            const error: ExtendCustomError = new Error('Invalid Input')
            error.data = errors
            error.code = 422
            throw error
        }
        const { email, name, password } = userInput
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error: CustomError = new Error('User already exists.')
            throw error
        }

        const hashedPassword = await bcrypt.hash(password, 12).catch(err => {
            console.error(err)
            throw err
        })

        const user = new User({
            email,
            name,
            password: hashedPassword
        })

        const createdUser = await user.save().catch(err => {
            console.error(err)
            throw err
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...createdUser._doc, _id: createdUser._id.toString() }
    },
    async login({ email, password }) {
        const user = await User.findOne({ email }).catch(err => {
            console.error(err)
            throw err
        })

        if (!user) {
            const error: CustomError = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        const isEqual = await bcrypt
            .compare(password, user.password)
            .catch(err => {
                console.error(err)
                throw new Error('Password Encrypt failed.')
            })

        if (!isEqual) {
            const error: CustomError = new Error('Password is incorrect')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            String(process.env.JWT_SECRET),
            { expiresIn: '1h' }
        )

        return { token }
    }
}
