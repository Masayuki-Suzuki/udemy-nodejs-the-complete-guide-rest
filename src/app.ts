import path from 'path'
import fs from 'fs'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import multer from 'multer'
import { v4 as uuidV4 } from 'uuid'
import feedRoutes from './routes/feed'
import authRoutes from './routes/auth'

dotenv.config()
const app = express()
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = './src/public/images/'
        try {
            fs.statSync(dest)
        } catch (_) {
            fs.mkdirSync(dest)
        }
        cb(null, dest)
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidV4()}.${file.mimetype.split('/')[1]}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// Middle Wares.
app.use(bodyParser.json())
app.use(
    multer({
        storage: fileStorage,
        fileFilter
    }).single('image')
)

// Public directories
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('/dist/src/public'))

// Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// Routing
app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

//eslint-disable-next-line
app.use((req: any, res) => {
    const status = req.statusCode || 500
    const message = req.message
    const data = req.data || []
    res.status(status).json({ message, data })
})

mongoose
    .connect(process.env.MONGO_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        user: process.env.db_user,
        pass: process.env.db_password,
        dbName: process.env.db_database
    })
    .then(() => {
        console.info('Mongoose: connected DB.')

        app.listen(8080, () => {
            console.info('Server started.')
        })
    })
    .catch(err => {
        console.error(err)
    })
