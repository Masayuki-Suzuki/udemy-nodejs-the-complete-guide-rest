import express from 'express'
import { body } from 'express-validator'
import User from '../models/user'
import { login, signUp } from '../controllers/auth'
import { AsyncController } from '../types/utils'

const router = express.Router()

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'Email address already exists!'
                            )
                        }
                    })
                    .catch(err => console.error(err))
            }),
        body('password').trim().isLength({ min: 6 }),
        body('name').trim().not().isEmpty()
    ],
    signUp as AsyncController
)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', login as AsyncController)

export default router
