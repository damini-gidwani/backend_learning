const authorize = (policy, context) => {
  const allowed = policy(context);
  if (!allowed) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
  return true;
};
module.exports = authorize;