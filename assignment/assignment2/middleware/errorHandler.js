const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: [],
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for '${err.path}'`;
    errors = [
      {
        field: err.path,
        value: err.value,
        message: "Invalid value",
      },
    ];
  }

  // Mongoose validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      value: error.value,
      message: error.message,
    }));

    message = "Validation failed";
  }

  // MongoDB duplicate key error
  else if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    message = "Conflict";

    errors = [
      {
        field,
        value,
        message: `This ${field} already exists`,
      },
    ];
  }

  const response = {
    success: false,
    message,
    errors,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};