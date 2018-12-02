export default role => (req, res, next) => {
  if (req.user) {
    if (req.user.role && req.user.role === role) {
      next();
    } else {
      res.status(401).json({
        errors: [ 'Unauthorized request' ],
      });
    }
  } else {
    throw new Error('The user attribute is not set');
  }
};
