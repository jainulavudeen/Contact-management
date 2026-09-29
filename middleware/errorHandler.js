// 404 for unknown routes
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
};

// Central error handler
const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors (required, regex, minlength...)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  // Duplicate key (unique contactId / email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      message: `A contact with this ${field} already exists`,
      errors: [{ field, message: `${field} '${err.keyValue[field]}' is already in use` }],
    });
  }

  // Invalid cast (e.g. wrong type in a query)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid value for ${err.path}` });
  }

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
};

module.exports = { notFound, errorHandler };
