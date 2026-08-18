import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// =====================================================
// EMPLOYER DASHBOARD
// =====================================================

export const getEmployerDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    }).sort("-createdAt");

    const totalJobs = jobs.length;

    const jobIds = jobs.map(
      (job) => job._id
    );

    // ===============================
    // İSTATİSTİKLER
    // ===============================

    const [
      totalApplications,
      acceptedApplications,
      pendingApplications,
      rejectedApplications,
    ] = await Promise.all([
      Application.countDocuments({
        job: { $in: jobIds },
      }),

      Application.countDocuments({
        job: { $in: jobIds },
        status: "Accepted",
      }),

      Application.countDocuments({
        job: { $in: jobIds },
        status: "Pending",
      }),

      Application.countDocuments({
        job: { $in: jobIds },
        status: "Rejected",
      }),
    ]);

    // ===============================
    // SON BAŞVURULAR
    // ===============================

    const recentApplications =
      await Application.find({
        job: { $in: jobIds },
      })
        .populate(
          "applicant",
          "name email avatar"
        )
        .populate(
          "job",
          "title company"
        )
        .sort("-createdAt")
        .limit(5);

    // ===============================
    // SON İLANLAR
    // ===============================

    const recentJobs = jobs.slice(0, 5);

    // ===============================
    // POPÜLER İLANLAR
    // ===============================

    const popularJobs = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount =
          await Application.countDocuments({
            job: job._id,
          });

        return {
          _id: job._id,
          title: job.title,
          company: job.company,
          applicationCount,
        };
      })
    );

    popularJobs.sort(
      (a, b) =>
        b.applicationCount -
        a.applicationCount
    );

    // ===============================
    // GRAFİK
    // ===============================

    const chartData = [
      {
        name: "Kabul",
        value: acceptedApplications,
      },
      {
        name: "Bekleyen",
        value: pendingApplications,
      },
      {
        name: "Reddedilen",
        value: rejectedApplications,
      },
    ];

    res.status(200).json({
      success: true,

      stats: {
        totalJobs,
        totalApplications,
        acceptedApplications,
        pendingApplications,
        rejectedApplications,
      },

      chartData,

      recentApplications,

      recentJobs,

      popularJobs:
        popularJobs.slice(0, 5),
    });
  } catch (error) {
    console.error(
      "EMPLOYER DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Dashboard verileri alınamadı.",
    });
  }
};


// =====================================================
// ŞİRKET PROFİLİ GETİR
// =====================================================

export const getCompanyProfile = async (req, res) => {
  try {
    const company = await User.findById(req.user._id).select(
      "-password"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "İşveren bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      "GET COMPANY PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Şirket profili alınamadı.",
    });
  }
};


export const updateCompanyProfile = async (req, res) => {
  try {
    const company = await User.findById(
      req.user._id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "İşveren bulunamadı.",
      });
    }

    const allowedFields = [
      "companyName",
      "companyLogo",
      "companyWebsite",
      "companySize",
      "companyDescription",
      "companyAddress",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: "Şirket profili güncellendi.",
      company,
    });
  } catch (error) {
    console.error(
      "UPDATE COMPANY PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Şirket profili güncellenemedi.",
    });
  }
};