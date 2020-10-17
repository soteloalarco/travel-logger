const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// simple json response
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

// In case route is invalid
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // forwarding to error handleing
  res.status(404);
  next(error);
});

// Error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = res.Statuscode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'pancake' : error.stack,
  });
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
