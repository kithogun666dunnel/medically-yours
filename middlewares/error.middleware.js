export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
};
