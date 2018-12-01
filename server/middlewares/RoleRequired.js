export default role => (req, res, next) => {
  if (req.user && req.user.role) {
    if (req.user.role === role) {
      next();
    } else {
      res.status(401).json({
        errors: 'Unauthorized request',
      });
    }
  } else {
    throw new Error('The user attribute is not set');
  }
};
