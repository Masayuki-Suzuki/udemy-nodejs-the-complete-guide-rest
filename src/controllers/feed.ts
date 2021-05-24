import { Document } from 'mongoose'
import { validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../types/utils'
import Post from '../models/post'
import User from '../models/user'
import { clearImage } from '../libs/imageController'

type Creator = {
    name: string
}

type PostType = {
    _id: string
    title: string
    creator: Creator
    content: string
    imageURL: string
    createdAt: Date | string
    updatedAt: Date | string | null
}

export const getPosts = async (
    req: Request,
    res: Response,
    next
): Promise<void> => {
    const currentPage = parseInt(req.query.page as string, 10) || 1
    const PER_PAGE = 2
    let totalItems = 0
    const count = await Post.find()
        .countDocuments()
        .catch((err: CustomError) => {
            console.error(err)
            next(err)
        })

    totalItems = count
    const posts = await Post.find()
        .populate('creator')
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .catch((err: CustomError) => {
            console.error(err)
            next(err)
        })

    if (!posts) {
        const err: CustomError = new Error('Could not find posts.')
        err.statusCode = 404
        res.status(404).json({ error: err })
    }

    res.status(200).json({ posts, totalItems })
}

export const getPost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { postId } = req.params
    const post = await Post.findById(postId).catch((err: CustomError) => {
        console.error(err.message)
        err.statusCode = 500
        next(err)
    })

    if (!post) {
        const err: CustomError = new Error('Could not find a post.')
        err.statusCode = 404
        next(err)
    } else {
        res.status(200).json({ post })
    }
}

export const createPost = async (req, res, next): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err: CustomError = new Error(
            'Validation failed: entered data is incorrect.'
        )
        err.statusCode = 422
        next(err)
    }

    if (!req.file) {
        const err: CustomError = new Error('No image provided.')
        err.statusCode = 422
        next(err)
    }

    const imageURL = req.file.path.replace('src/public/', '')

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageURL,
        creator: req.userId
    })

    const result = await post.save().catch((err: CustomError) => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

    const user = await User.findById(req.userId).catch(err => {
        console.error(err)
        next(err)
    })

    getIo().emit('posts', {
        action: 'create',
        post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    })

    user.posts.push(post)
    await user.save().catch((err: CustomError) => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

    res.status(201).json({
        message: 'success!',
        creator: { _id: user._id, name: user.name },
        post
    })
}

export const updatePost = async (req, res, next): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err: CustomError = new Error(
            'Validation failed: entered data is incorrect.'
        )
        err.statusCode = 422
        next(err)
    }

    const { postId } = req.params
    const { title, content } = req.body
    let { image: imageURL } = req.body

    if (req.file) {
        imageURL = req.file.path.replace('src/public/', '')
    }
    if (!imageURL) {
        const err: CustomError = new Error('No file picked')
        err.statusCode = 422
        next(err)
    }

    const post = await Post.findById(postId)
        .populate('creator')
        .catch(err => {
            console.error(err)
            next(err)
        })

    if (!post) {
        const err: CustomError = new Error('Could not find a post.')
        err.statusCode = 404
        next(err)
    } else {
        if (post.creator._id.toString() !== req.userId.toString()) {
            const err: CustomError = new Error('Not authorized.')
            err.statusCode = 403
            next(err)
            throw err
        } else {
            if (imageURL !== post.imageURL) {
                clearImage(post.imageURL)
            }

            post.title = title
            post.imageURL = imageURL
            post.content = content
            const result = post.save()

            getIo().emit('posts', { action: 'update', post: result })

            res.status(200).json({ post })
        }
    }
}

export const deletePost = async (req, res, next): Promise<void> => {
    const { postId } = req.params
    const post: PostType & Document = await Post.findById(postId).catch(err => {
        console.error(err)
        next(err)
    })

    if (!post) {
        const err: CustomError = new Error('Could not find a post.')
        err.statusCode = 404
        next(err)
    } else {
        if (post.creator.toString() !== req.userId.toString()) {
            const err: CustomError = new Error('Not authorized.')
            err.statusCode = 403
            next(err)
            throw err
        } else {
            const result = await Post.findByIdAndDelete(postId).catch(err => {
                console.error(err)
                next(err)
            })
            if (result) {
                const user = await User.findById(req.userId).catch(err => {
                    console.error(err)
                    next(err)
                })

                if (user) {
                    user.posts.pull(postId)
                    await user.save().catch(err => {
                        console.error(err)
                        next(err)
                    })
                    clearImage(post.imageURL)
                    console.info(result)
                    getIo().emit('posts', { action: 'delete', post: postId })
                    res.status(200).json({
                        message: 'deleted post.',
                        id: postId
                    })
                } else {
                    const error: CustomError = new Error('Not authorized')
                    error.statusCode = 403
                    next(error)
                }
            }
        }
    }
}
