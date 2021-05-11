import mongoose from 'mongoose'

const Schema = mongoose.Schema

export default new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)
