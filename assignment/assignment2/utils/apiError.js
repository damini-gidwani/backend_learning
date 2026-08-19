const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.errors = errors;

  return error;
};

const badRequest = (message, errors = []) => {
  return createError(400, message, errors);
};

const unauthorized = (message = "Unauthorized") => {
  return createError(401, message);
};

const forbidden = (message = "Forbidden") => {
  return createError(403, message);
};

const notFound = (message = "Resource not found") => {
  return createError(404, message);
};

const conflict = (message = "Conflict", errors = []) => {
  return createError(409, message, errors);
};

module.exports = {
  createError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};