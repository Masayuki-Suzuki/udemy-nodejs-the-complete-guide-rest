import mongoose from 'mongoose'
import postSchema from '../schemas/post'

export default mongoose.model('Post', postSchema)
