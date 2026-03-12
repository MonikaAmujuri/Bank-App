export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
          console.log("Allowed roles:", roles);
      return res.status(403).json({
        
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};