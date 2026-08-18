import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ==========================================
    // Authorization Header
    // ==========================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    // ==========================================
    // Token yok
    // ==========================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yetkisiz erişim.",
      });
    }

    // ==========================================
    // Token doğrula
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // Kullanıcıyı bul
    // ==========================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    // ==========================================
    // Hesap aktif mi?
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Hesabınız pasif durumda. Yönetici ile iletişime geçin.",
      });
    }

    // ==========================================
    // Kullanıcıyı request'e ekle
    // ==========================================

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Geçersiz veya süresi dolmuş token.",
    });
  }
};