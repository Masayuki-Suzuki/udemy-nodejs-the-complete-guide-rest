import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Post from '../models/post'

type Creator = {
    name: string
}

type Post = {
    _id: string
    title: string
    creator: Creator
    content: string
    imageURL: string
    createdAt: Date | string
    updatedAt: Date | string | null
}

type CustomError = {
    statusCode?: number
} & Error

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.find().catch((err: CustomError) => {
        console.error(err)
        err.statusCode = 500
        res.status(500).json({ error: err })
    })

    if (!posts) {
        const err: CustomError = new Error('Could not find posts.')
        err.statusCode = 404
        res.status(404).json({ error: err })
    }

    res.status(200).json({ posts })
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

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err: CustomError = new Error(
            'Validation failed: entered data is incorrect.'
        )
        err.statusCode = 422
        next(err)
    }

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageURL: '/images/rubber-duck.png',
        creator: { name: 'Test User' }
    })

    const result = await post.save().catch((err: CustomError) => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

    res.status(201).json({
        message: 'success!',
        post: result
    })
}
