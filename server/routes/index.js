const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const authentication = require('../middlewares/authentication')
const authRouter = require('./auth')
const tripRouter = require('./trip')

const router = express.Router()

router.use('/auth', authRouter)
router.use(authentication)
router.use('/trips', tripRouter)
router.use(errorHandler)

module.exports = router