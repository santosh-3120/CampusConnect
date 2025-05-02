module.exports = (roles) => (req, res, next) => {
    console.log('Role middleware:', req.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
};