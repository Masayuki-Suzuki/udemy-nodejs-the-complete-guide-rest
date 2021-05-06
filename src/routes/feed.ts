import express from 'express'
import { body } from 'express-validator'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost
} from '../controllers/feed'
import isAuth from '../middleware/is-auth'
import { AsyncController } from '../types/utils'

const router = express.Router()
//eslint-disable-next-line
router.get('/posts', isAuth, getPosts as AsyncController)
//eslint-disable-next-line
router.get('/post/:postId', isAuth, getPost as AsyncController)

router.post(
    '/post',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ],
    isAuth,
    createPost
)

router.put(
    '/post/:postId',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ],
    isAuth,
    updatePost as AsyncController
)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/post/:postId', isAuth, deletePost as AsyncController)

export default router
