if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config()
}
const express = require('express')
const router = require('./routes')
const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

module.exports = app