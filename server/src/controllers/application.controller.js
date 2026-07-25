import Application from "../models/Application.js";
import Job from "../models/Job.js";

// İş ilanına başvur
export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Bu ilana zaten başvurdunuz.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Giriş yapan adayın başvuruları
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
    path: "job",
    select:
      "title company location salary employmentType createdBy",
    populate: {
        path: "createdBy",
        select: "name email avatar",
    },
})
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// İşverene ait ilana gelen başvurular
export const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu ilana gelen başvuruları görme yetkiniz yok.",
      });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("applicant", "name email cv")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Başvuru durumunu güncelle
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum.",
      });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Başvuru bulunamadı.",
      });
    }

    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu başvuruyu güncelleme yetkiniz yok.",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};