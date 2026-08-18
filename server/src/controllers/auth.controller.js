import User from "../models/User.js";
import Job from "../models/Job.js";
import { generateToken } from "../utils/generateToken.js";

// =====================================================
// REGISTER
// =====================================================

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["candidate", "employer"];

    const selectedRole = allowedRoles.includes(role)
      ? role
      : "candidate";


    console.log("REGISTER BODY:", req.body);
    console.log("REGISTER ROLE:", role);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar zorunludur.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email zaten kayıtlı.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole,
    });

    const token = generateToken(user._id);

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      bio: user.bio,
      github: user.github,
      linkedin: user.linkedin,
      avatar: user.avatar,
      cv: user.cv,
      resume: user.resume,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      companyWebsite: user.companyWebsite,
      companySize: user.companySize,
      companyDescription: user.companyDescription,
      companyAddress: user.companyAddress,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };

    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email ve şifre gereklidir.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Email veya şifre hatalı.",
      });
    }

    // Pasif kullanıcı giriş yapamasın
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Hesabınız pasif durumda.",
      });
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Email veya şifre hatalı.",
      });
    }

    const token =
      generateToken(user._id);

    res.status(200).json({
      success: true,
      token,

      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        cv: user.cv,
        resume: user.resume,
        avatar: user.avatar,
        companyName:
          user.companyName,
        companyLogo:
          user.companyLogo,
        companyWebsite:
          user.companyWebsite,
        companySize:
          user.companySize,
        companyDescription:
          user.companyDescription,
        companyAddress:
          user.companyAddress,
        isVerified:
          user.isVerified,
        isActive:
          user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Giriş sırasında hata oluştu.",
    });
  }
};


// =====================================================
// ME
// =====================================================

export const me = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "ME ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Kullanıcı bilgileri alınamadı.",
    });
  }
};


// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      phone,
      city,
      github,
      linkedin,
      bio,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    user.name =
      name?.trim() || user.name;

    user.phone =
      phone ?? user.phone;

    user.city =
      city ?? user.city;

    user.github =
      github ?? user.github;

    user.linkedin =
      linkedin ?? user.linkedin;

    user.bio =
      bio ?? user.bio;

    await user.save();

    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Profil başarıyla güncellendi.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Profil güncellenemedi.",
    });
  }
};


// =====================================================
// UPLOAD CV
// =====================================================

export const uploadCV = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Lütfen PDF dosyası seçiniz.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    user.cv =
      `/uploads/cv/${req.file.filename}`;

    user.cvOriginalName =
      req.file.originalname;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "CV başarıyla yüklendi.",
      cv: user.cv,
      cvOriginalName:
        user.cvOriginalName,
    });
  } catch (error) {
    console.error(
      "UPLOAD CV ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "CV yüklenemedi.",
    });
  }
};


// =====================================================
// FAVORİ İLAN EKLE / ÇIKAR
// =====================================================

export const toggleSavedJob = async (
  req,
  res
) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message:
          "İlan bilgisi gerekli.",
      });
    }

    const job =
      await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "İlan bulunamadı.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    const index =
      user.savedJobs.findIndex(
        (id) =>
          id.toString() ===
          jobId.toString()
      );

    if (index > -1) {
      user.savedJobs.splice(
        index,
        1
      );

      await user.save();

      return res.status(200).json({
        success: true,
        saved: false,
        message:
          "Favorilerden kaldırıldı.",
      });
    }

    user.savedJobs.push(jobId);

    await user.save();

    res.status(200).json({
      success: true,
      saved: true,
      message:
        "Favorilere eklendi.",
    });
  } catch (error) {
    console.error(
      "TOGGLE SAVED JOB ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Favori işlemi başarısız.",
    });
  }
};


// =====================================================
// FAVORİ İLANLAR
// =====================================================

export const getSavedJobs = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).populate("savedJobs");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      jobs: user.savedJobs,
    });
  } catch (error) {
    console.error(
      "GET SAVED JOBS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Favoriler alınamadı.",
    });
  }
};


// =====================================================
// UPLOAD RESUME
// =====================================================

export const uploadResume = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Lütfen bir CV dosyası seçiniz.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    user.resume =
      req.file.filename;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "CV başarıyla yüklendi.",
      resume: user.resume,
    });
  } catch (error) {
    console.error(
      "UPLOAD RESUME ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "CV yüklenemedi.",
    });
  }
};


// =====================================================
// UPLOAD AVATAR
// =====================================================

export const uploadAvatar = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Lütfen bir fotoğraf seçiniz.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Kullanıcı bulunamadı.",
      });
    }

    user.avatar =
      `/uploads/avatars/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(
      "UPLOAD AVATAR ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Profil fotoğrafı yüklenemedi.",
    });
  }
};