const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Giriş yapmalısınız.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bu işlem için admin yetkisi gerekiyor.",
    });
  }

  next();
};

export default adminOnly;