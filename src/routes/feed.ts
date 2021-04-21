import express from 'express'
import { createPost, getPosts } from '../controllers/feed'

const router = express.Router()

router.get('/posts', getPosts)
router.post('/post', createPost)

export default router
