import AppError from '../Utils/appError';

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 404);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const values = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field ${values} : Enter another value`;
  return new AppError(message, 404);
};

const handleJWTError = () => new AppError("Invalid token please login again", 401);

const handleJWTExpiredError = () => new AppError("Your token has expired", 401);

const sendDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProd = (err, res) => {
  // Known cause from code
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else { // unknown
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'SOMETHING BAD HAPPENED',
    });
  }
};


const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProd(error, res);
  }
};



export default globalErrorHandler;
