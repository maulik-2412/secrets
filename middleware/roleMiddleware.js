

function checkRole(roles,customMessage) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).send('Please Login as Viewer');
      }
      const userRole = req.user.role;  
      console.log(req.user);
      if (!roles.includes(userRole)) {
        return res.status(403).send(customMessage || 'Forbidden');
      }
  
      next();
    };
  }
  
  module.exports = checkRole;
  