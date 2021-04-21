import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
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
    res.setHeader('Access-Control-Allow-Headers', 'ContentType, Authorization')
    next()
})

// Routing
app.use('/feed', feedRoutes)

app.listen(8080, () => {
    console.log('server started.')
})
