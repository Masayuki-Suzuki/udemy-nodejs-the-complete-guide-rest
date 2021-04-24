import express from 'express'
import { body } from 'express-validator'
import { createPost, getPost, getPosts } from '../controllers/feed'
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

export default router
