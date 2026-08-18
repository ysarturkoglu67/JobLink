import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

// ==========================================
// İLANI FAVORİLERE EKLE
// ==========================================

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "İlan ID gerekli.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const exists = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Bu ilan zaten favorilerinizde.",
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "İlan favorilere eklendi.",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// FAVORİLERİ GETİR
// ==========================================

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      user: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select:
            "name email companyLogo companyName avatar",
        },
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// FAVORİDEN ÇIKAR
// ==========================================

export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Bu ilan favorilerinizde değil.",
      });
    }

    await SavedJob.findByIdAndDelete(
      savedJob._id
    );

    res.status(200).json({
      success: true,
      message: "İlan favorilerden çıkarıldı.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// FAVORİ Mİ KONTROLÜ
// ==========================================

export const checkSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: req.params.jobId,
    });

    res.status(200).json({
      success: true,
      saved: !!savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};