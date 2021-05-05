import express from 'express'
import { body } from 'express-validator'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost
} from '../controllers/feed'
import { AsyncController } from '../types/utils'

const router = express.Router()
//eslint-disable-next-line
router.get('/posts', getPosts as AsyncController)
//eslint-disable-next-line
router.get('/post/:postId', getPost as AsyncController)

router.post(
    '/post',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ],
    createPost
)

router.put(
    '/post/:postId',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ],
    updatePost as AsyncController
)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/post/:postId', deletePost as AsyncController)

export default router
