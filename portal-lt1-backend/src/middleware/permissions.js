function requirePermission(permissionCode) {
  return function permissionGuard(req, res, next) {
    const permissions = req.user?.permissions || [];

    if (!permissions.includes(permissionCode)) {
      return res.status(403).json({
        message: 'Nu ai permisiunea necesara pentru aceasta actiune.',
        required: permissionCode,
        role: req.user?.role || null
      });
    }

    return next();
  };
}

function requireAnyPermission(...permissionCodes) {
  return function permissionGuard(req, res, next) {
    const permissions = req.user?.permissions || [];
    const allowed = permissionCodes.some((code) => permissions.includes(code));

    if (!allowed) {
      return res.status(403).json({
        message: 'Nu ai permisiunea necesara pentru aceasta actiune.',
        requiredAny: permissionCodes,
        role: req.user?.role || null
      });
    }

    return next();
  };
}

module.exports = {
  requirePermission,
  requireAnyPermission
};
