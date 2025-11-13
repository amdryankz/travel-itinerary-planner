const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const authentication = require('../middlewares/authentication')
const authRouter = require('./auth')
const tripRouter = require('./trip')
const activityRouter = require('./activity')
const expenseRouter = require('./expense')
const aiRouter = require('./ai')

const router = express.Router()

router.use('/auth', authRouter)
router.use(authentication)
router.use('/trips', tripRouter)
router.use('/activities', activityRouter)
router.use('/expenses', expenseRouter)
router.use('/ai', aiRouter)
router.use(errorHandler)

module.exports = router