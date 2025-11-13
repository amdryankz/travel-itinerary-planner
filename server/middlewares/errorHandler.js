const errorHandler = (err, req, res, next) => {
  console.log(err);

  let message = "Internal Server Error"
  let status = 500

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    message = err.errors.map(el => el.message)
    status = 400
  }

  if (err.name === "SequelizeForeignKeyConstraintError" || err.name === "SequelizeDatabaseError" || err.name === "MulterError") {
    message = "Invalid input type"
    status = 400
  }

  if (err.name === "BadRequest") {
    message = "Email or Password is required"
    status = 400
  }

  if (err.name === "LoginError") {
    message = "Email or Password is invalid"
    status = 401
  }

  if (err.name === "JsonWebTokenError" || err.name === "Unauthorized") {
    message = "Please login first"
    status = 401
  }

  if (err.name === "Forbidden") {
    message = "You don't have any access"
    status = 403
  }

  if (err.name == 'NotFound') {
    status = 404
    message = `Data with id ${err.id} not found`
  }

  if (err.name == 'NotFoundFile') {
    status = 404
    message = `Data file not found`
  }

  return res.status(status).json({ message })
}

module.exports = errorHandler