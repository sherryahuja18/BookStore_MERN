

const authenticateAdminOrUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      req.user = user;
  
      // Check if the user is either an admin or a regular user
      if (user.role === 'admin' || user.role === 'user') {
        return next();
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
    })(req, res, next);
};

const authenticateAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user || user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      req.user = user;
      return next();
    })(req, res, next);
}




module.exports = {authenticateAdminOrUser,authenticateAdmin} ;