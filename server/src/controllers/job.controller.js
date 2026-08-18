import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import SavedJob from "../models/SavedJob.js";
import Interview from "../models/Interview.js";

// =====================================================
// YENİ İŞ İLANI OLUŞTUR
// =====================================================

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      location,
      salary,
      category,
      experience,
      education,
      employmentType,
      description,
      requirements,
      skills,
      benefits,
      deadline,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Zorunlu alanları doldurunuz.",
      });
    }

    if (!salary || Number(salary) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Maaş 0'dan büyük olmalıdır.",
      });
    }
    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Zorunlu alanları doldurunuz.",
      });
    }

    if (!salary || Number(salary) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Maaş 0'dan büyük olmalıdır.",
      });
    }


    const job = await Job.create({
      title,
      company,
      companyLogo,
      location,
      salary,
      category,
      experience,
      education,
      employmentType,
      description,
      requirements,
      skills,
      benefits,
      deadline,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "İş ilanı başarıyla oluşturuldu.",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// TÜM İŞ İLANLARINI GETİR
// =====================================================

// Tüm iş ilanlarını getir
export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      employmentType,
      category,
      experience,
      minSalary,
      maxSalary,
      sort,
    } = req.query;

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    // Query
    const query = {
      isActive: true,
    };

    // Keyword arama
    // Keyword arama
    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          company: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          location: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Lokasyon
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Çalışma tipi
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Kategori
    if (category) {
      query.category = category;
    }

    // Deneyim
    if (experience) {
      query.experience = experience;
    }

    // Maaş
    if (minSalary || maxSalary) {
      query.salary = {};

      if (minSalary) {
        query.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        query.salary.$lte = Number(maxSalary);
      }
    }

    // Toplam ilan
    const totalJobs = await Job.countDocuments(query);

    // İlan sorgusu
    let jobsQuery = Job.find(query).populate(
      "createdBy",
      "name email companyLogo companyName avatar"
    );

    // Sıralama
    if (sort) {
      jobsQuery = jobsQuery.sort(sort);
    } else {
      jobsQuery = jobsQuery.sort("-createdAt");
    }

    // Pagination
    const jobs = await jobsQuery
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalJobs,

      totalPages: Math.ceil(totalJobs / limit),

      count: jobs.length,

      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// TEK İŞ İLANI GETİR
// =====================================================

// Tek iş ilanı getir
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    ).populate(
      "createdBy",
      "name email companyLogo companyName avatar"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// İŞ İLANINI GÜNCELLE
// =====================================================

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    // İlan sahibi kontrolü
    if (
      job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bu ilanı güncelleme yetkiniz yok.",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "İş ilanı güncellendi.",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// İŞ İLANINI SİL
// =====================================================

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    // İlan sahibi kontrolü
    if (
      job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bu ilanı silme yetkiniz yok.",
      });
    }

    // İlana ait başvuruları da sil
    await Application.deleteMany({
      job: req.params.id,
    });

    await SavedJob.deleteMany({
      job: req.params.id,
    });

    await Interview.deleteMany({
      job: req.params.id,
    });

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "İş ilanı ve başvuruları silindi.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// İŞVERENİN KENDİ İLANLARI
// =====================================================

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EMPLOYER DASHBOARD İSTATİSTİKLERİ
// =====================================================

export const getEmployerStats = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    });

    const pending = applications.filter(
      (application) =>
        application.status === "Pending"
    ).length;

    const accepted = applications.filter(
      (application) =>
        application.status === "Accepted"
    ).length;

    const rejected = applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

    res.status(200).json({
      success: true,

      totalJobs: jobs.length,

      totalApplications: applications.length,

      pending,

      accepted,

      rejected,

      totalViews: jobs.reduce(
        (total, job) => total + job.views,
        0
      ),

      latestJobs: jobs
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPublicStats = async (req, res) => {
  try {
    const [
      totalJobs,
      totalCandidates,
      totalEmployers,
      totalApplications,
    ] = await Promise.all([
      Job.countDocuments({ isActive: true }),

      User.countDocuments({
        role: "candidate",
        isActive: true,
      }),

      User.countDocuments({
        role: "employer",
        isActive: true,
      }),

      Application.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalCandidates,
        totalEmployers,
        totalApplications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// İLAN AKTİF / PASİF
// =====================================================

export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    // İlan sahibi kontrolü
    if (
      job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu ilanı değiştirme yetkiniz yok.",
      });
    }

    job.isActive = !job.isActive;

    await job.save();

    res.status(200).json({
      success: true,
      message: job.isActive
        ? "İlan tekrar aktif edildi."
        : "İlan pasif hale getirildi.",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};