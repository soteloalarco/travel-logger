const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // forwarding to error handleing
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode = res.Statuscode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'pancake' : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
