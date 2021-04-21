import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

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
    updated_at: Date | string | null
}

export const getPosts = (req: Request, res: Response): void => {
    const responseData: { posts: Post[] } = {
        posts: [
            {
                _id: uuidv4(),
                title: 'Test Post',
                creator: {
                    name: 'Test User'
                },
                content: 'This is test post.',
                imageURL: '/images/rubber-duck.png',
                createdAt: new Date().toISOString(),
                updated_at: null
            }
        ]
    }
    res.status(200).json(responseData)
}

export const createPost = (req: Request, res: Response): void => {
    const post: Post = {
        _id: uuidv4(),
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: null
    }
    res.status(201).json({
        message: 'success!',
        post
    })
}
