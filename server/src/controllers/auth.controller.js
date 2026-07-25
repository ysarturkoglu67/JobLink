import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import Job from "../models/Job.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "candidate",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        cv: user.cv,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre zorunludur.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Giriş başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        cv: user.cv,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ME
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      github,
      linkedin,
      bio,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.city = city ?? user.city;
    user.github = github ?? user.github;
    user.linkedin = linkedin ?? user.linkedin;
    user.bio = bio ?? user.bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil başarıyla güncellendi.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPLOAD CV
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Lütfen PDF dosyası seçiniz.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    user.cv = `/uploads/cv/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      message: "CV başarıyla yüklendi.",
      cv: user.cv,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const toggleSavedJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    const index = user.savedJobs.findIndex(
      (id) => id.toString() === jobId
    );

    if (index > -1) {
      user.savedJobs.splice(index, 1);

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Favorilerden kaldırıldı.",
      });
    }

    user.savedJobs.push(jobId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Favorilere eklendi.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSavedJobs = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate("savedJobs");

    res.status(200).json({
      success: true,
      jobs: user.savedJobs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Favorilere eklendi",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.resume = req.file.filename;

    await user.save();

    res.json({
      success: true,
      message: "CV başarıyla yüklendi.",
      resume: user.resume,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const uploadAvatar = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    user.avatar = req.file.filename;

    await user.save();

    res.json({
      success: true,
      avatar: user.avatar,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};