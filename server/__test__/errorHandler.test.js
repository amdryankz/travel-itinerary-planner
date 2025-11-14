const errorHandler = require('../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    console.log = jest.fn(); // Mock console.log
  });

  test('should handle SequelizeValidationError', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [
        { message: 'Email must be unique' },
        { message: 'Name is required' }
      ]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: ['Email must be unique', 'Name is required']
    });
  });

  test('should handle SequelizeUniqueConstraintError', () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Email must be unique' }]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: ['Email must be unique']
    });
  });

  test('should handle SequelizeForeignKeyConstraintError', () => {
    const error = {
      name: 'SequelizeForeignKeyConstraintError'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid input type'
    });
  });

  test('should handle SequelizeDatabaseError', () => {
    const error = {
      name: 'SequelizeDatabaseError'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid input type'
    });
  });

  test('should handle BadRequest error', () => {
    const error = {
      name: 'BadRequest'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email or Password is required'
    });
  });

  test('should handle InvalidDateRange error', () => {
    const error = {
      name: 'InvalidDateRange'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'End date must be after start date'
    });
  });

  test('should handle NoActivities error', () => {
    const error = {
      name: 'NoActivities'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No activities to optimize'
    });
  });

  test('should handle QueryBadRequest error', () => {
    const error = {
      name: 'QueryBadRequest'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Query is required'
    });
  });

  test('should handle AddressBadRequest error', () => {
    const error = {
      name: 'AddressBadRequest'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Address is required'
    });
  });

  test('should handle PlaceBadRequest error', () => {
    const error = {
      name: 'PlaceBadRequest'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Origin and destination are required'
    });
  });

  test('should handle QueryLocationBadRequest error', () => {
    const error = {
      name: 'QueryLocationBadRequest'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Query and location are required'
    });
  });

  test('should handle LoginError', () => {
    const error = {
      name: 'LoginError'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email or Password is invalid'
    });
  });

  test('should handle JsonWebTokenError', () => {
    const error = {
      name: 'JsonWebTokenError'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please login first'
    });
  });

  test('should handle Unauthorized error', () => {
    const error = {
      name: 'Unauthorized'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please login first'
    });
  });

  test('should handle Forbidden error', () => {
    const error = {
      name: 'Forbidden'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "You don't have any access"
    });
  });

  test('should handle NotFound error', () => {
    const error = {
      name: 'NotFound',
      id: '123'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Data with id 123 not found'
    });
  });

  test('should handle NotFoundFile error', () => {
    const error = {
      name: 'NotFoundFile'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Data file not found'
    });
  });

  test('should handle MulterError', () => {
    const error = {
      name: 'MulterError'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid input type'
    });
  });

  test('should handle unknown errors with 500 status', () => {
    const error = {
      name: 'UnknownError',
      message: 'Something went wrong'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error'
    });
  });
});
