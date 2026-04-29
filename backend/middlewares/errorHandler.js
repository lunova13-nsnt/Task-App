const { ValidationError, UniqueConstraintError } = require('sequelize');

// Central error handler — must be registered LAST in Express
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err);

  // Sequelize validation errors (e.g. email format, empty fields)
  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Sequelize unique constraint (e.g. duplicate email)
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
    });
  }

  // Express-validator errors (passed manually)
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Generic server error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

// 404 handler for unknown routes
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFound };
