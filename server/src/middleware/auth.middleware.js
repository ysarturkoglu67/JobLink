import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token yoksa
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yetkisiz erişim.",
      });
    }

    console.log("Token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    // Kullanıcıyı bul
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Hatası:", error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};