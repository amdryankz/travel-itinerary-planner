const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library')
const { signToken } = require('../utils/jwt')
const bcrypt = require('bcryptjs')

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body
      const user = await User.create({
        name, email, password
      })

      delete user.dataValues.password

      return res.status(201).json({
        message: "User registered successfully",
        data: user
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) throw { name: "BadRequest" }

      const user = await User.findOne({
        where: {
          email
        }
      })

      const comparePassword = await bcrypt.compare(password, user.password)

      if (!user || !comparePassword) throw { name: "LoginError" }

      const payload = {
        id: user.id,
        email: user.email,
      }

      const token = signToken(payload)

      res.status(200).json({
        token
      })
    } catch (err) {
      next(err)
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers
      const client = new OAuth2Client()

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const gPayload = ticket.getPayload()

      const [user, created] = await User.findOrCreate({
        where: {
          email: gPayload.email
        },
        defaults: {
          email: gPayload.email,
          password: "google_password"
        }
      })

      const payload = {
        id: user.id,
        email: user.email,
      }

      const access_token = signToken(payload)

      res.status(200).json({
        token: access_token
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthController