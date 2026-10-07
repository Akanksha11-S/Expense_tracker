exports.notFound = (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON.' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'That id is not valid.' });
  }
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach((e) => (errors[e.path] = e.message));
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'An account with this email already exists.', errors: { email: 'Email is already registered.' } });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side. Please try again.' });
};
