import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import feedRoutes from './routes/feed'

dotenv.config()
const app = express()

// Middle Wares.
app.use(bodyParser.json())

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
//eslint-disable-next-line
app.use((req: any, res) => {
    console.error(req)
    const status = req.statusCode || 500
    const message = req.message
    res.status(status).json({ message })
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
