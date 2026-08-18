import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import Message from "../models/Message.js";


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      candidates,
      employers,
      recentUsers,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),

      Job.countDocuments(),

      Application.countDocuments(),

      User.countDocuments({
        role: "candidate",
      }),

      User.countDocuments({
        role: "employer",
      }),

      User.find()
        .select("-password")
        .sort("-createdAt")
        .limit(5),

      Job.find()
        .populate("createdBy", "name email")
        .sort("-createdAt")
        .limit(5),

      Application.find()
        .populate("applicant", "name")
        .populate("job", "title")
        .sort("-createdAt")
        .limit(5),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        candidates,
        employers,
      },

      recentUsers,
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Dashboard verileri alınamadı.",
    });
  }
};


// =====================================================
// TÜM KULLANICILAR
// =====================================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "GET USERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Kullanıcılar alınamadı.",
    });
  }
};


// =====================================================
// TÜM İLANLAR
// =====================================================

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "createdBy",
        "name email companyName"
      )
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(
      "GET ADMIN JOBS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "İlanlar alınamadı.",
    });
  }
};


// =====================================================
// KULLANICI SİL
// =====================================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin kendisini silemesin
    if (
      id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Kendi admin hesabınızı silemezsiniz.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    // Kullanıcının oluşturduğu ilanlar
    const userJobs = await Job.find({
      createdBy: id,
    }).select("_id");

    const jobIds = userJobs.map(
      (job) => job._id
    );

    // Kullanıcının ilanlarına ait başvurular
    await Application.deleteMany({
      job: { $in: jobIds },
    });

    // Kullanıcının ilanlarına ait mülakatlar
    await Interview.deleteMany({
      job: { $in: jobIds },
    });

    // Kullanıcının ilanlarını sil
    await Job.deleteMany({
      createdBy: id,
    });

    // Kullanıcının gönderdiği/alduğu mesajlar
    await Message.deleteMany({
      $or: [
        { sender: id },
        { receiver: id },
      ],
    });

    // Kullanıcının başvuruları
    await Application.deleteMany({
      applicant: id,
    });

    // Kullanıcının mülakatları
    await Interview.deleteMany({
      $or: [
        { employer: id },
        { candidate: id },
      ],
    });

    // Kullanıcıyı sil
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Kullanıcı ve ilişkili verileri silindi.",
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Kullanıcı silinemedi.",
    });
  }
};


// =====================================================
// İLAN SİL
// =====================================================

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İlan bulunamadı.",
      });
    }

    await Application.deleteMany({
      job: id,
    });

    await Interview.deleteMany({
      job: id,
    });

    await Job.findByIdAndDelete(id);

    // Kullanıcıların favorilerinden kaldır
    await User.updateMany(
      {
        savedJobs: id,
      },
      {
        $pull: {
          savedJobs: id,
        },
      }
    );

    res.status(200).json({
      success: true,
      message:
        "İlan ve ilişkili verileri silindi.",
    });
  } catch (error) {
    console.error(
      "ADMIN DELETE JOB ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "İlan silinemedi.",
    });
  }
};


// =====================================================
// DASHBOARD GRAFİKLERİ
// =====================================================

export const getDashboardCharts = async (
  req,
  res
) => {
  try {
    const [
      applicationsByStatus,
      jobsByType,
      usersByRole,
    ] = await Promise.all([
      Application.aggregate([
        {
          $group: {
            _id: "$status",
            total: { $sum: 1 },
          },
        },
      ]),

      Job.aggregate([
        {
          $group: {
            _id: "$employmentType",
            total: { $sum: 1 },
          },
        },
      ]),

      User.aggregate([
        {
          $group: {
            _id: "$role",
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      applicationsByStatus,
      jobsByType,
      usersByRole,
    });
  } catch (error) {
    console.error(
      "ADMIN CHART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Grafik verileri alınamadı.",
    });
  }
};


// =====================================================
// KULLANICI AKTİF / PASİF
// =====================================================

export const toggleUserStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // Admin kendisini pasif yapamasın
    if (
      id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Kendi admin hesabınızı pasif yapamazsınız.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      success: true,
      isActive: user.isActive,
      message: user.isActive
        ? "Kullanıcı aktif edildi."
        : "Kullanıcı pasif yapıldı.",
    });
  } catch (error) {
    console.error(
      "TOGGLE USER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Kullanıcı durumu değiştirilemedi.",
    });
  }
};


// =====================================================
// İŞVEREN DOĞRULA
// =====================================================

export const verifyEmployer = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    if (user.role !== "employer") {
      return res.status(400).json({
        success: false,
        message:
          "Sadece işveren hesapları doğrulanabilir.",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        message: "İşveren zaten doğrulanmış.",
      });
    }

    user.isVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "İşveren doğrulandı.",
    });
  } catch (error) {
    console.error(
      "VERIFY EMPLOYER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "İşveren doğrulanamadı.",
    });
  }
};