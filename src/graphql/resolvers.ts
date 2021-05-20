import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { CustomError } from '../types/utils'
import Post from '../models/post'

type ValidationError = {
    message: string
}

type PostDocument = {
    _id: string
    title: string
    imageURL: string
    content: string
    createdAt: Date | string
    updatedAt: Date | string
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

        return {
            token,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        }
    },
    async createPost({ postInput: { title, content, imageURL } }, req) {
        if (!req.isAuth) {
            const error: CustomError = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        const errors: ValidationError[] = []

        if (
            validator.isEmpty(title) ||
            !validator.isLength(title, { min: 6 })
        ) {
            errors.push({ message: 'Title is invalid.' })
        }

        if (
            validator.isEmpty(content) ||
            !validator.isLength(content, { min: 4 })
        ) {
            errors.push({ message: 'Title is invalid.' })
        }

        if (errors.length) {
            const error: ExtendCustomError = new Error('Invalid Input')
            error.data = errors
            error.code = 422
            throw error
        }

        const user = await User.findById(req.userId)

        if (!user) {
            const error: ExtendCustomError = new Error('Invalid User')
            error.code = 401
            throw error
        }

        const post = new Post({
            title,
            content,
            imageURL,
            creator: user
        })

        if (!post) {
            const error: CustomError = new Error(
                `Couldn't create new post with some error.`
            )
            error.statusCode = 500
            throw error
        }

        const createdPost = await post.save().catch(err => {
            console.error(err.message)
            console.error(err)

            const error: CustomError = new Error(
                `Couldn't create new post with some error.`
            )
            error.statusCode = 500
            throw error
        })

        user.posts.push(createdPost)
        await user.save()

        const params: PostDocument = {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
            creator: user
        }

        return params
    },
    async posts({ page = 1 }, req) {
        if (!req.isAuth) {
            const error: CustomError = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }
        const PAR_PAGE = 2
        const totalPost = await Post.find().countDocuments()
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * PAR_PAGE)
            .limit(PAR_PAGE)
            .populate('creator')

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const postsDocs = posts.map(p => ({
            ...p._doc,
            _id: p._id.toString(),
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString()
        }))

        return {
            posts: postsDocs,
            totalPost
        }
    }
}
